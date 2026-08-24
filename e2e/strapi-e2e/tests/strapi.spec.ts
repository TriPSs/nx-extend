import { readJsonFile } from '@nx/devkit'
import { checkFilesExist, rmDist, tmpProjPath } from '@nx/plugin/testing'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { ensureNxProject } from '../../utils/workspace'
import { runNxCommandAsync } from '../../utils/run-nx-command-async'

describe('(e2e) strapi', () => {
  beforeAll(() => ensureNxProject([
    '@nx-extend/core:dist/packages/core',
    '@nx-extend/strapi:dist/packages/strapi'
  ]))

  const appName = 'test-strapi'

  it('should be able to generate', async () => {
    await runNxCommandAsync(`generate @nx-extend/strapi:init ${appName}`)

    expect(() => checkFilesExist(
      `${appName}/src/index.ts`,
      `${appName}/config/admin.ts`
    )).not.toThrow()

    const packageJson = readJsonFile(join(tmpProjPath(), appName, 'package.json'))
    expect(packageJson.dependencies['@strapi/strapi']).toMatch('5.52.1')

    // The generator deliberately skips installs; install the generated application
    // separately so the build exercises the project's local Strapi 5 CLI.
    execSync('touch yarn.lock', {
      cwd: join(tmpProjPath(), appName),
      stdio: 'inherit'
    })

    execSync('yarn install', {
      cwd: join(tmpProjPath(), appName),
      stdio: 'inherit'
    })
  })

  it('should be able to build', async () => {
    rmDist()
    await runNxCommandAsync(`build ${appName}`)

    expect(() => checkFilesExist(
      `dist/${appName}/package.json`,
      `dist/${appName}/config/admin.js`,
      `dist/${appName}/config/api.js`,
      `dist/${appName}/config/database.js`,
      `dist/${appName}/src/index.js`,
      `dist/${appName}/build/index.html`
    )).not.toThrow()
  })
})
