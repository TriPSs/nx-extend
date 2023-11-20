import { ExecutorContext, workspaceRoot } from '@nx/devkit'
import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'
import { join } from 'path'

import 'dotenv/config'

import { copyFavicon } from '../../utils/copy-favicon'
import { copyFolderSync } from '../../utils/copy-folder'
import { createPackageJson } from '../../utils/create-package-json'

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
): Promise<{
  success: boolean
}> {
  const { root } = context.workspace.projects[context.projectName]

  if (!options.outputPath) {
    throw new Error('No "outputPath" defined in options!')
  }

  const distDir = join(process.cwd(), options.outputPath)

  // Set the env vars
  Object.keys(options.envVars || {}).forEach(function (key) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = options.envVars[key]
    }
  })

  const strapiRoot = join(workspaceRoot, options.root || root)

  await createPackageJson(
    options.outputPath,
    strapiRoot,
    context,
    options.generateLockFile
  )

  execPackageManagerCommand(buildCommand([
    'strapi build',
    '--ignore-prompts',
    Boolean(options.production) && '--minify'
  ]), {
    cwd: options.root || root,
    env: process.env
  })

  await copyFolderSync(`${strapiRoot}/dist`, `${distDir}`)
  await copyFolderSync(`${strapiRoot}/public`, `${distDir}/public`)
  await copyFavicon(`${strapiRoot}`, distDir)
  await copyFavicon(`${strapiRoot}/public`, distDir)

  return { success: true }
}

export default buildExecutor
