import { ExecutorContext } from '@nrwl/devkit'
import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph'
import { map, tap } from 'rxjs/operators'
import { eachValueFrom } from 'rxjs-for-await'
import { resolve } from 'path'
import { getNodeWebpackConfig } from '@nrwl/node/src/utils/node.config'
import { OUT_FILENAME } from '@nrwl/node/src/utils/config'
import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'
import { normalizeBuildOptions } from '@nrwl/node/src/utils/normalize'
import { runWebpack } from '@nrwl/node/src/utils/run-webpack'
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  createTmpTsConfig
} from '@nrwl/workspace/src/utilities/buildable-libs-utils'

import { generatePackageJson } from '../../utils/generate-package-json'
import { generatePackageJsonLockFile } from '../../utils/generate-package-json-lock-file'

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
} catch {
  // do nothing
}

export interface RawOptions extends BuildNodeBuilderOptions {
  generateLockFile?: boolean
}

export type NodeBuildEvent = {
  outfile: string
  success: boolean
}

export async function* buildExecutor(
  rawOptions: RawOptions,
  context: ExecutorContext
) {
  const { sourceRoot, root } = context.workspace.projects[context.projectName]

  if (!sourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`)
  }

  if (!root) {
    throw new Error(`${context.projectName} does not have a root.`)
  }

  const options = normalizeBuildOptions(
    rawOptions,
    context.root,
    sourceRoot,
    root
  )

  if (!options.buildLibsFromSource) {
    const { target, dependencies } = calculateProjectDependencies(
      readCachedProjectGraph(),
      context.root,
      context.projectName,
      context.targetName,
      context.configurationName
    )
    options.tsConfig = createTmpTsConfig(
      options.tsConfig,
      context.root,
      target.data.root,
      dependencies
    )

    if (
      !checkDependentProjectsHaveBeenBuilt(
        context.root,
        context.projectName,
        context.targetName,
        dependencies
      )
    ) {
      return { success: false }
    }
  }

  const config = options.webpackConfig.reduce((currentConfig, plugin) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(plugin)(currentConfig, {
      options,
      configuration: context.configurationName
    })
  }, getNodeWebpackConfig(options))

  return yield* eachValueFrom(
    runWebpack(config).pipe(
      tap((stats) => {
        console.info(stats.toString(config.stats))
      }),
      map((stats) => {
        return {
          success: !stats.hasErrors(),
          outfile: resolve(context.root, options.outputPath, OUT_FILENAME)
        } as NodeBuildEvent
      }),
      tap(({ outfile }) => (
        generatePackageJson(context.projectName, readCachedProjectGraph(), options, outfile, context.root)
      )),
      tap(() => {
        if (rawOptions.generateLockFile) {
          generatePackageJsonLockFile(context.projectName, options, context.root)
        }
      }),
      tap(() => ({
        success: true
      }))
    )
  )
}

export default buildExecutor
