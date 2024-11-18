import { ExecutorContext, logger } from '@nx/devkit'
import axios from 'axios'

import BaseProvider from '../providers/base.provider'
import { BaseConfigFile } from '../utils/config-file'

export interface Message {
  key: string

  value: string
}

export const DEEPL_SUPPORT_LANGUAGES = [
  'BG',
  'CS',
  'DA',
  'DE',
  'EL',
  'EN-GB',
  'EN-US',
  'ES',
  'ET',
  'FI',
  'FR',
  'HU',
  'ID',
  'IT',
  'JA',
  'LT',
  'LV',
  'NL',
  'PL',
  'PT-BR',
  'PT-PT',
  'RO',
  'RU',
  'SK',
  'SL',
  'SV',
  'TR',
  'UK',
  'ZH'
]

export default class DeeplTranslator {
  private readonly apiKey = process.env.DEEPL_API_KEY

  private readonly endpoint: string

  private readonly context: ExecutorContext

  private readonly config: BaseConfigFile

  private readonly formalitySupportedLangs = [
    'de',
    'fr',
    'it',
    'es',
    'nl',
    'pl',
    'pt-pt',
    'pt-br',
    'ru'
  ]

  constructor(
    context: ExecutorContext,
    config: BaseConfigFile,
    endpoint: string
  ) {
    this.endpoint = endpoint
    this.context = context
    this.config = config
  }

  public async translateAll<Provider extends BaseProvider<BaseConfigFile>>(
    provider: Provider
  ) {
    if (!this.apiKey) {
      throw new Error('No "DEEPL_API_KEY" defined!')
    }

    // All the languages
    const languages = [...this.config.languages]

    // Source terms
    const sourceTerms = provider.getSourceTerms()

    while (languages.length > 0) {
      const code = languages.shift()

      if (code !== this.config.defaultLanguage) {
        const terms = await provider.getTranslations(code)
        const toTranslate = []

        Object.keys(sourceTerms).forEach((sourceTerm) => {
          const content = terms[sourceTerm]

          // If term is not defined use the source term
          if (!content || content.length === 0) {
            toTranslate.push({
              key: sourceTerm,
              value: sourceTerms[sourceTerm]
            })
          }
        })

        console.log('\r\n')
        const translatorTerms = await this.translate(toTranslate, code)
        const translatedTerms = {}
        console.log('\r\n')

        translatorTerms.map((translatorTerm) => {
          translatedTerms[translatorTerm.key] = translatorTerm.value
        })

        // Get the existing terms from file
        const existingTerms = provider.getLanguageTerms(code)

        // Merge translated terms with existing
        provider.writeLocaleToFile(
          code,
          Object.assign(existingTerms, translatedTerms)
        )

        // Upload the translations to the provider
        await provider.uploadTranslations(code, translatedTerms)
      }
    }
  }

  public async translate(messages: Message[], toLocale: string) {
    if (!this.apiKey) {
      throw new Error('No "DEEPL_API_KEY" defined!')
    }

    const translatedMessages = []
    for (const message of messages) {
      process.stdout.clearLine(-1)
      process.stdout.cursorTo(0)
      process.stdout.write(
        `[DeepL] Translating "${toLocale}" ${(
          ((translatedMessages.length + 1) / messages.length) *
          100
        ).toFixed(2)}%`
      )

      const url = [
        `${this.endpoint}/v2/translate?`,
        `auth_key=${this.apiKey}`,
        `text=${message.value
          .replace(/{/g, '<deepSkip>')
          .replace(/}/g, '</deepSkip>')
          .replace(/'<a'/g, '<deepLink')
          .replace(/'<\/a>'/g, '</deepLink>')}`,
        `target_lang=${toLocale.split('_').shift().split('-').shift()}`,
        `source_lang=${this.config.defaultLanguage.split('_').shift().split('-').shift()}`,
        'preserve_formatting=1',
        'tag_handling=xml',
        'ignore_tags=deepSkip',
        this.config?.translatorOptions?.formality &&
        this.formalitySupportedLangs.includes(toLocale) &&
        `formality=${this.config.translatorOptions.formality}`
      ].filter(Boolean)

      const { status, data } = await axios.get(url.join('&'),{
        validateStatus: () => true
      })

      if (status === 429) {
        logger.warn('To many requests, wait and retry')

      } else if (status === 456) {
        throw new Error('Rate limit!')

      } else if (status === 400) {
        translatedMessages.push({
          key: message.key,
          value: 'Error translating!'
        })

        continue
      }

      translatedMessages.push({
        key: message.key,
        value: data.translations[0].text
          .replace(/<deepSkip>/g, '{')
          .replace(/<\/deepSkip>/g, '}')
          .replace(/<deepLink/g, '\'<a\'')
          .replace(/<\/deepLink>/g, '\'</a>\'')
      })
    }

    return translatedMessages
  }
}
