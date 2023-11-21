import {
  checkFilesExist,
  rmDist,
  runNxCommandAsync
} from '@nx/plugin/testing'
import { ensureNxProject } from '../../utils/workspace'

describe('(e2e) strapi', () => {
  beforeAll(() => ensureNxProject([
    '@nx-extend/core:dist/packages/core',
    '@nx-extend/strapi:dist/packages/strapi'
  ]))

  const appName = 'test-strapi'

  it('should be able to generate', async () => {
    await runNxCommandAsync(`generate @nx-extend/strapi:init ${appName}`)

    expect(() => checkFilesExist(
      `${appName}/src/index.ts`
    )).not.toThrow()
  }, 300000)

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
  }, 300000)
})
