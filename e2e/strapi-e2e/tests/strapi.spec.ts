import {
  checkFilesExist,
  rmDist,
  runNxCommandAsync
} from '@nx/plugin/testing'
import { ensureNxProject } from '../../utils/workspace'

describe('(e2e) strapi', () => {
  beforeAll(() => {
    ensureNxProject([
      '@nx-extend/core:dist/packages/core',
      '@nx-extend/strapi:dist/packages/strapi'
    ])
  })

  const appName = 'test-strapi'

  it('should be able to generate', async () => {
    await runNxCommandAsync(`generate @nx-extend/strapi:init ${appName}`)

    expect(() => checkFilesExist(
      `${appName}/src/main.ts`
    )).not.toThrow()
  }, 300000)

  it('should be able to build a function', async () => {
    await runNxCommandAsync(`build ${appName}`)

    // TODO
  }, 300000)

  it('should be able to build a function and generate lock file', async () => {
    rmDist()
    await runNxCommandAsync(`build ${appName} --prod`)

    // TODO
  }, 300000)
})
