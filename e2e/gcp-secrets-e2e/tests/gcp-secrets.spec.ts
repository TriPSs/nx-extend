import {
  checkFilesExist,
  runNxCommandAsync,
  uniq
} from '@nx/plugin/testing'

import { ensureNxProject } from '../../utils/workspace'

describe('gcp-secrets e2e', () => {
  beforeAll(() => {
    ensureNxProject([
      '@nx-extend/core:dist/packages/core',
      '@nx-extend/gcp-secrets:dist/packages/gcp-secrets'
    ])
  })

  const appName = uniq('gcp-secrets')

  it('should be able to generate an secrets app', async () => {
    await runNxCommandAsync(`generate @nx-extend/gcp-secrets:init ${appName}`)

    expect(() => checkFilesExist(
      `${appName}/src/secret-one.json`,
      `${appName}/src/secret-two.json`
    )).not.toThrow()
  })
})
