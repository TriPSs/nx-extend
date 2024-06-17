import { ensureNxProject, installDeps } from '../../utils/workspace'
import { runNxCommandAsync } from '../../utils/run-nx-command-async'
import { checkFilesExist, rmDist } from '@nx/plugin/testing'

describe('(e2e) docusaurus', () => {
  beforeAll(() => ensureNxProject([
    '@nx-extend/core:dist/packages/core',
    '@nx-extend/docusaurus:dist/packages/docusaurus'
  ]))

  const appName = 'test-docusaurus'

  it('should be able to generate', async () => {
    await runNxCommandAsync(`generate @nx-extend/docusaurus:app ${appName}`)
    installDeps()

    expect(() => checkFilesExist(
      `${appName}/docusaurus.config.ts`
    )).not.toThrow()
  })

  it('should be able to build', async () => {
    rmDist()
    await runNxCommandAsync(`build ${appName}`)

    expect(() => checkFilesExist(
      `dist/${appName}/index.html`,
      `dist/${appName}/sitemap.xml`
    )).not.toThrow()
  })
})
