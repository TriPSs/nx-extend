import { ExecutorContext } from '@nrwl/devkit'
import { buildAdmin } from '@strapi/strapi/lib/commands/builders'
import tsUtils from '@strapi/typescript-utils'
import { join } from 'path'

import 'dotenv/config'

import { copyFavicon } from '../../utils/copy-favicon'
import { copyFolderSync } from '../../utils/copy-folder'
import { createPackageJson } from '../../utils/create-package-json'

export interface BuildExecutorSchema {
  production?: boolean
  outputPath: string
  envVars?: Record<string, string>
}

export async function buildExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root, sourceRoot } = context.workspace.projects[context.projectName]

  if (!options.outputPath) {
    throw new Error('No "outputPath" defined in options!')
  }

  const strapiRoot = root || sourceRoot
  const distDir = join(process.cwd(), options.outputPath)

  // Set the env vars
  Object.keys(options.envVars || {}).forEach(function (key) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = options.envVars[key]
    }
  })

  await tsUtils.compile(strapiRoot, {
    watch: false,
    configOptions: {
      options: {
        incremental: true,
        outDir: distDir
      }
    }
  })

  await buildAdmin({
    forceBuild: true,
    optimization: Boolean(options.production),
    buildDestDir: distDir,
    srcDir: strapiRoot
  })

  await createPackageJson(options.outputPath, strapiRoot, context)
  await copyFolderSync(`${strapiRoot}/public`, `${distDir}/public`)
  await copyFavicon(`${strapiRoot}`, distDir)
  await copyFavicon(`${strapiRoot}/public`, distDir)

  return { success: true }
}

export default buildExecutor
