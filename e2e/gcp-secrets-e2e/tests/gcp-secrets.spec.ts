import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing'

describe('gcp-secrets e2e', () => {

  it('should be able to generate an secrets app', async () => {
    const plugin = uniq('gcp-functions')
    ensureNxProject('@nx-extend/gcp-secrets', 'dist/packages/gcp-secrets')

    await runNxCommandAsync(`generate @nx-extend/gcp-secrets:init ${plugin}`)

    expect(() =>
      checkFilesExist(
        `apps/${plugin}/src/secret-one.json`,
        `apps/${plugin}/src/secret-two.json`,
      )
    ).not.toThrow()
  }, 300000)

})
