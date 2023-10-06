import {
  runNxCommandAsync,
  readJson,
  updateFile
} from '@nx/plugin/testing'
import { ensureNxProject } from '../../utils/workspace'

describe('translations e2e', () => {
  beforeAll(() => {
    ensureNxProject([
      '@nx-extend/core:dist/packages/core',
      '@nx-extend/translations:dist/packages/translations'
    ])
  })

  const appName = 'translations'
  it('should be able to add', async () => {
    await runNxCommandAsync(`generate @nx/react:app ${appName} --no-interactive --e2eTestRunner=none`)
    await runNxCommandAsync(`generate @nx-extend/translations:add ${appName}`)

    expect(readJson(`${appName}/project.json`).targets).toEqual(
      expect.objectContaining({
        'extract-translations': {
          executor: '@nx-extend/translations:extract',
          options: {}
        },
        'pull-translations': {
          executor: '@nx-extend/translations:pull',
          options: {}
        },
        'push-translations': {
          executor: '@nx-extend/translations:push',
          options: {}
        },
        translate: {
          executor: '@nx-extend/translations:translate',
          options: {}
        }
      })
    )

    expect(readJson(`${appName}/.translationsrc.json`)).toEqual({
      extends: '../.translationsrc.json',
      projectName: appName
    })

    expect(readJson('.translationsrc.json')).toEqual({
      provider: 'none',
      outputDirectory: '<projectRoot>/src/translations',
      outputLanguages: '<projectRoot>/src/translations/locales.json',
      defaultLanguage: 'en',
      translator: 'none',
      translatorOptions: {},
      languages: ['en']
    })
  }, 300000)

  it('should be able to extract translations', async () => {
    updateFile(
      `${appName}/src/app/app.tsx`,
      `
    import { FormattedMessage, useIntl } from 'react-intl'

    export function App() {
      const intl = useIntl()

      console.log(intl.formatMessage({
        id: 'message-id-2',
        defaultMessage: 'Message 2'
      }))

      return (
        <div>
          <FormattedMessage
            id={'message-id'}
            defaultMessage={'Message'} />
        </div>
      )
    }

    export default App
    `)

    await runNxCommandAsync(`extract-translations ${appName}`)

    expect(readJson(`${appName}/src/translations/en.json`)).toEqual({
      'message-id': 'Message',
      'message-id-2': 'Message 2'
    })
  }, 300000)
})
