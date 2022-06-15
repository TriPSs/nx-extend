import webpackExecutor, { NodeBuildEvent } from '@nrwl/node/src/executors/webpack/webpack.impl'

import { ExecutorContext } from '@nrwl/devkit'
import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph'
import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'
import { normalizeBuildOptions } from '@nrwl/node/src/utils/normalize'

import { generatePackageJson } from '../../utils/generate-package-json'
import { generatePackageJsonLockFile } from '../../utils/generate-package-json-lock-file'

export interface RawOptions extends BuildNodeBuilderOptions {
  generateLockFile?: boolean
}

export async function buildExecutor(
  rawOptions: RawOptions,
  context: ExecutorContext
): Promise<NodeBuildEvent> {
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

  const { value } = await webpackExecutor(rawOptions, context)
    .next()

  if (value.success) {
    generatePackageJson(context.projectName, readCachedProjectGraph(), options, value.outfile, context.root)

    if (rawOptions.generateLockFile) {
      generatePackageJsonLockFile(context.root, context.projectName, options)
    }
  }

  return value
}

export default buildExecutor
