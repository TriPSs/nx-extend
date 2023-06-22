import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq
} from '@nx/plugin/testing'

describe('gcp-secrets e2e', () => {
  beforeEach(() => {
    ensureNxProject('@nx-extend/gcp-secrets', 'dist/packages/gcp-secrets')
  })

  it('should be able to generate an secrets app', async () => {
    const plugin = uniq('gcp-functions')

    await runNxCommandAsync(`generate @nx-extend/gcp-secrets:init ${plugin}`)

    expect(() =>
      checkFilesExist(
        `apps/${plugin}/src/secret-one.json`,
        `apps/${plugin}/src/secret-two.json`
      )
    ).not.toThrow()
  }, 300000)
})
