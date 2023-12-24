import {
  runNxCommandAsync,
  readJson,
  updateFile, readFile
} from '@nx/plugin/testing'
import { ensureNxProject } from '../../utils/workspace'

describe('react email e2e', () => {

  beforeAll(() => ensureNxProject([
    '@nx-extend/core:dist/packages/core',
    '@nx-extend/react-email:dist/packages/react-email'
  ]))

  const appName = 'react-email-test'
  it('should be able to init', async () => {
    await runNxCommandAsync(`generate @nx-extend/react-email:init ${appName}`)

    expect(readJson(`${appName}/project.json`).targets).toEqual(
      expect.objectContaining({
        serve: {
          executor: '@nx-extend/react-email:serve',
          options: {}
        },
        export: {
          executor: '@nx-extend/react-email:export',
          outputs: ['{options.outputPath}'],
          defaultConfiguration: 'production',
          options: {
            outputPath: `dist/${appName}`
          },
          configurations: {
            production: {
              pretty: false
            }
          }
        }
      })
    )
  })

  it('should be able to export', async () => {
    await runNxCommandAsync(`export ${appName}`)

    expect(readFile(`dist/${appName}/index.html`)).toMatchSnapshot()
  })
})
