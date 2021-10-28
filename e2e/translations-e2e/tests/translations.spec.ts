import {
  ensureNxProject,
  runNxCommandAsync,
  readJson,
  updateFile
} from '@nrwl/nx-plugin/testing'

describe('translations e2e', () => {

  beforeEach(() => {
    ensureNxProject('@nx-extend/translations', 'dist/packages/translations')
  })

  it('should be able to add', async () => {
    await runNxCommandAsync('generate @nrwl/react:app test-app --style=css --no-interactive')
    await runNxCommandAsync('generate @nx-extend/translations:add test-app')

    expect(readJson('apps/test-app/project.json').targets).toEqual(expect.objectContaining({
      'extract-translations': {
        'executor': '@nx-extend/translations:extract',
        'options': {}
      },
      'pull-translations': {
        'executor': '@nx-extend/translations:pull',
        'options': {}
      },
      'push-translations': {
        'executor': '@nx-extend/translations:push',
        'options': {}
      },
      'translate': {
        'executor': '@nx-extend/translations:translate',
        'options': {}
      }
    }))

    expect(readJson('apps/test-app/.translationsrc.json')).toEqual({
      'extends': '../../.translationsrc.json',
      'projectName': 'test-app'
    })

    expect(readJson('.translationsrc.json')).toEqual({
      'provider': 'none',
      'outputDirectory': '<projectRoot>/src/translations',
      'outputLanguages': '<projectRoot>/src/translations/locales.json',
      'defaultLanguage': 'en',
      'translator': 'none',
      'translatorOptions': {},
      'languages': [
        'en'
      ]
    })
  }, 300000)

  it('should be able to extract translations', async () => {
    await runNxCommandAsync('generate @nrwl/react:app test-app --style=css --no-interactive')
    await runNxCommandAsync('generate @nx-extend/translations:add test-app')

    updateFile('apps/test-app/src/app/app.tsx', `
    import { FormattedMessage } from 'react-intl'

    export function App() {
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

    await runNxCommandAsync('extract-translations test-app')

    expect(readJson('apps/test-app/src/translations/en.json')).toEqual({
      'message-id': 'Message'
    })
  }, 300000)
})
