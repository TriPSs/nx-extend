import { execSync } from 'child_process'
import { dirname } from 'path'
import { cleanup, patchPackageJsonForPlugin, tmpProjPath } from '@nx/plugin/testing'
import { mkdirSync } from 'fs'

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

  execSync('rm -f yarn.lock package-lock.json && touch yarn.lock', {
    cwd: tmpProjectPath,
    stdio: 'inherit',
    env: process.env
  })

  execSync('yarn set version berry', {
    cwd: tmpProjectPath,
    stdio: 'inherit',
    env: process.env
  })

  // This fixes lock file changes in CI
  execSync('yarn install --mode=update-lockfile', {
    cwd: tmpProjectPath,
    stdio: 'inherit',
    env: process.env
  })

  installDeps()

  execSync('echo "enableHardenedMode: false" >> .yarnrc.yml', {
    cwd: tmpProjectPath,
    stdio: 'inherit',
    env: process.env
  })
}

export function installDeps() {
  const tmpProjectPath = tmpProjPath()

  execSync('yarn install --immutable', {
    cwd: tmpProjectPath,
    stdio: 'inherit',
    env: process.env
  })
}
