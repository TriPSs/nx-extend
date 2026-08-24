import { detectPackageManager, ExecutorContext, getPackageManagerCommand, workspaceRoot } from '@nx/devkit'
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

import 'dotenv/config'

import { copyFavicon } from '../../utils/copy-favicon'
import { copyFolderSync } from '../../utils/copy-folder'
import { createPackageJson } from '../../utils/create-package-json'

const run = promisify(execFile)

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
  const packageManager = getPackageManagerCommand(detectPackageManager()).exec.split(' ')

  await run(packageManager[0], [
    ...packageManager.slice(1),
    'strapi',
    'build',
    ...(options.production ? ['--minify'] : [])
  ], {
    cwd: strapiRoot,
    env: process.env
  })

  // Strapi 5 writes compiled server files to dist and the Vite admin build to build.
  if (existsSync(join(strapiRoot, 'dist'))) {
    copyFolderSync(join(strapiRoot, 'dist'), distDir)
  }

  if (existsSync(join(strapiRoot, 'build'))) {
    copyFolderSync(join(strapiRoot, 'build'), join(distDir, 'build'))
  }

  await createPackageJson(
    options.outputPath,
    strapiRoot,
    context,
    options.generateLockFile
  )

  if (existsSync(join(strapiRoot, 'public'))) {
    copyFolderSync(join(strapiRoot, 'public'), join(distDir, 'public'))
  }

  copyFavicon(`${strapiRoot}`, distDir)
  copyFavicon(`${strapiRoot}/public`, distDir)

  return { success: true }
}

export default buildExecutor
