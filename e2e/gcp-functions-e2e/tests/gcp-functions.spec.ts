import {
  checkFilesExist,
  rmDist,
  runNxCommandAsync
} from '@nx/plugin/testing'
import { ensureNxProject } from '../../utils/workspace'

describe('(e2e) gcp-functions', () => {
  beforeAll(() => {
    ensureNxProject([
      '@nx-extend/core:dist/packages/core',
      '@nx-extend/gcp-functions:dist/packages/gcp-functions'
    ])
  })

  const appName = 'test-function'

  it('should be able to generate an empty function', async () => {
    await runNxCommandAsync(`generate @nx-extend/gcp-functions:init ${appName}`)

    expect(() => checkFilesExist(
      `${appName}/src/main.ts`,
      `${appName}/src/environments/production.yaml`
    )).not.toThrow()
  })

  it('should be able to build a function', async () => {
    await runNxCommandAsync(`build ${appName}`)

    expect(() => checkFilesExist(
      `dist/${appName}/main.js`,
      `dist/${appName}/package.json`
    )).not.toThrow()
  })

  it('should be able to build a function and generate lock file', async () => {
    rmDist()
    await runNxCommandAsync(`build ${appName} --generateLockFile`)

    expect(() => checkFilesExist(
      `dist/${appName}/main.js`,
      `dist/${appName}/package.json`,
      `dist/${appName}/yarn.lock`
    )).not.toThrow()
  })

  it('should be able the runner', async () => {
    const runnerName = 'functions-runner'
    await runNxCommandAsync(`generate @nx-extend/gcp-functions:init-runner ${runnerName}`)

    expect(() => checkFilesExist(
      `${runnerName}/src/main.ts`
    )).not.toThrow()
  })
})
