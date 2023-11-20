import { execSync } from 'child_process'
import { dirname } from 'path'
import { cleanup, patchPackageJsonForPlugin, tmpProjPath } from '@nx/plugin/testing'
import { mkdirSync } from 'fs'
import { logger } from '@nx/devkit'

function runNxNewCommand(localTmpDir: string) {
  return execSync(
    `npx nx new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nx/workspace --npmScope=proj --preset=apps`,
    {
      cwd: localTmpDir
    }
  )
}

/**
 * Ensures that a project has been setup in the e2e directory
 * It will also copy `@nx` packages to the e2e directory
 */
export function ensureNxProject(patchPlugins: string[] = []): void {
  cleanup()

  const tmpProjectPath = tmpProjPath()
  const tmpProjectDir = dirname(tmpProjectPath)
  mkdirSync(tmpProjectDir, {
    recursive: true
  })
  runNxNewCommand(tmpProjectDir)

  for (const plugin of patchPlugins) {
    const [npmPackageName, pluginDistPath] = plugin.split(':')
    patchPackageJsonForPlugin(npmPackageName, pluginDistPath)
  }

  execSync('rm -f yarn.lock && touch yarn.lock', {
    cwd: tmpProjectPath,
    stdio: 'inherit',
    env: process.env
  })

  execSync('yarn set version berry', {
    cwd: tmpProjectPath,
    stdio: 'inherit',
    env: process.env
  })

  try {
    execSync('yarn install', {
      cwd: tmpProjectPath,
      stdio: 'inherit',
      env: process.env
    })
  } catch (err) {
    logger.warn(`Yarn install threw error: ${err.message}`)
  }
}
