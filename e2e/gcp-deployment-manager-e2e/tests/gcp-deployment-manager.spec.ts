import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing'
import { ensureNxProject } from '../../utils/workspace'

describe('gcp-deployment-manager e2e', () => {
  beforeAll(() => {
    ensureNxProject([
      '@nx-extend/core:dist/packages/core',
      '@nx-extend/gcp-deployment-manager:dist/packages/gcp-deployment-manager'
    ])
  })

  const appName = 'deployment-manager'

  it('should be able to generate an deployment manager app', async () => {
    await runNxCommandAsync(`generate @nx-extend/gcp-deployment-manager:init ${appName}`)

    expect(() => checkFilesExist(
      `${appName}/src/deployment.yml`
    )).not.toThrow()
  })
})
