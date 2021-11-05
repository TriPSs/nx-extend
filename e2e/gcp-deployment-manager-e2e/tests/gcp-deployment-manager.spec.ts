import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
  patchPackageJsonForPlugin
} from '@nrwl/nx-plugin/testing'

describe('gcp-deployment-manager e2e', () => {

  beforeEach(() => {
    ensureNxProject('@nx-extend/core', 'dist/packages/core')
    ensureNxProject('@nx-extend/gcp-deployment-manager', 'dist/packages/gcp-deployment-manager')
    patchPackageJsonForPlugin('@nx-extend/core','dist/packages/core')
  })

  it('should be able to generate an deployment manager app', async () => {
    const plugin = uniq('gcp-functions')

    await runNxCommandAsync(`generate @nx-extend/gcp-deployment-manager:init ${plugin}`)

    expect(() =>
      checkFilesExist(`apps/${plugin}/src/deployment.yml`)
    ).not.toThrow()
  }, 300000)

})
