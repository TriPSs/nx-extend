import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing'

describe('(e2e) gcp-functions', () => {

  beforeEach(() => {
    ensureNxProject('@nx-extend/gcp-functions', 'dist/packages/gcp-functions')
  })

  it('should be able to generate an empty function', async () => {
    const plugin = uniq('gcp-functions')
    await runNxCommandAsync(`generate @nx-extend/gcp-functions:init ${plugin}`)

    expect(() =>
      checkFilesExist(
        `apps/${plugin}/src/main.ts`,
        `apps/${plugin}/src/environments/production.yaml`
      )
    ).not.toThrow()
  }, 300000)

  it('should be able to build a function', async () => {
    const plugin = uniq('gcp-functions')
    await runNxCommandAsync(`generate @nx-extend/gcp-functions:init ${plugin}`)
    await runNxCommandAsync(`build ${plugin}`)

    expect(() =>
      checkFilesExist(
        `dist/apps/${plugin}/main.js`,
        `dist/apps/${plugin}/package.json`
      )
    ).not.toThrow()
  }, 300000)

  it('should be able to build a function and generate lock file', async () => {
    const plugin = uniq('gcp-functions-lock-file')
    await runNxCommandAsync(`generate @nx-extend/gcp-functions:init ${plugin}`)
    await runNxCommandAsync(`build ${plugin} --generateLockFile`)

    expect(() =>
      checkFilesExist(
        `dist/apps/${plugin}/main.js`,
        `dist/apps/${plugin}/package.json`,
        `dist/apps/${plugin}/package-lock.json`
      )
    ).not.toThrow()
  }, 300000)

  it('should be able the runner', async () => {
    const plugin = uniq('gcp-functions-runner')
    await runNxCommandAsync(`generate @nx-extend/gcp-functions:init-runner ${plugin}`)

    expect(() =>
      checkFilesExist(
        `apps/${plugin}/src/main.ts`,
        `apps/${plugin}/src/__runner.controller.ts`,
        `apps/${plugin}/src/__runner.module.ts`
      )
    ).not.toThrow()
  }, 300000)

})
