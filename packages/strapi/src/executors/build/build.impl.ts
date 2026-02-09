import { ExecutorContext, workspaceRoot } from '@nx/devkit'
// @ts-expect-error it is there but there are no interfaces
import { build as nodeBuild } from '@strapi/admin/cli'
// @ts-expect-error it is there but there are no interfaces
import tsUtils from '@strapi/typescript-utils'
import { join } from 'path'

import 'dotenv/config'

import { copyFavicon } from '../../utils/copy-favicon'
import { copyFolderSync } from '../../utils/copy-folder'
import { createPackageJson } from '../../utils/create-package-json'
import { createStrapiLogger } from './utils/create-strapi-logger'
import { loadTsConfig } from './utils/load-ts-config'

export interface BuildExecutorSchema {
  production?: boolean
  root?: string
  tsConfig: string
  outputPath: string
  envVars?: Record<string, string>
  generateLockFile?: boolean
}

export async function buildExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.projectsConfigurations.projects[context.projectName]

  if (!options.outputPath) {
    throw new Error('No "outputPath" defined in options!')
  }

  if (!options.tsConfig) {
    throw new Error('No "tsConfig" defined in options!')
  }

  const distDir = join(process.cwd(), options.outputPath)

  // Set the env vars
  Object.keys(options.envVars || {}).forEach(function (key) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = options.envVars[key]
    }
  })

  const strapiRoot = join(workspaceRoot, options.root || root)
  const tsConfig = loadTsConfig(workspaceRoot, options.tsConfig)

  // nodeBuild somehow only compiles the admin panel
  await tsUtils.compile(strapiRoot, {
    watch: false,
    configOptions: {
      options: {
        incremental: true,
        outDir: distDir
      }
    }
  })

  await nodeBuild({
    ignorePrompts: true,
    minify: Boolean(options.production),
    cwd: strapiRoot,
    logger: createStrapiLogger(),
    tsConfig
  })

  await createPackageJson(
    options.outputPath,
    strapiRoot,
    context,
    options.generateLockFile
  )

  await copyFolderSync(`${strapiRoot}/public`, `${distDir}/public`)
  await copyFavicon(`${strapiRoot}`, distDir)
  await copyFavicon(`${strapiRoot}/public`, distDir)

  return { success: true }
}

export default buildExecutor
