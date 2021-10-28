import { ExecutorContext, logger } from '@nrwl/devkit'
import axios from 'axios'
import * as pMap from 'p-map'

import { BaseConfigFile } from '../utils/config-file'
import BaseProvider from '../providers/base.provider'

export interface Message {

  key: string

  value: string

}

export default class DeeplTranslator {

  private readonly apiKey = process.env.DEEPL_API_KEY

  private readonly endpoint: string

  private readonly context: ExecutorContext

  private readonly config: BaseConfigFile

  constructor(context: ExecutorContext, config: BaseConfigFile, endpoint: string) {
    this.endpoint = endpoint
    this.context = context
    this.config = config
  }

  public async translateAll<Provider extends BaseProvider<BaseConfigFile>>(provider: Provider) {
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

        Object.keys(terms)
          .forEach((term) => {
            const content = terms[term]

            // If term is not defined use the source term
            if (!content || content.length === 0) {
              toTranslate.push({
                key: term,
                value: sourceTerms[term]
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
        provider.writeLocaleToFile(code, Object.assign(existingTerms, translatedTerms))

        // Upload the translations to the provider
        await provider.uploadTranslations(code, translatedTerms)
      }
    }
  }

  public async translate(messages: Message[], toLocale: string) {
    if (!this.apiKey) {
      throw new Error('No "DEEPL_API_KEY" defined!')
    }

    return pMap(
      messages,
      async (message, index) => {
        process.stdout.clearLine(-1)
        process.stdout.cursorTo(0)
        process.stdout.write(`[DeepL] Translating "${toLocale}" ${(((index + 1) / messages.length) * 100).toFixed(2)}%`)

        const url = [
          `${this.endpoint}/v2/translate?`,
          `auth_key=${this.apiKey}`,
          `text=${
            message.value
              .replace(/{/g, '<deepSkip>')
              .replace(/}/g, '</deepSkip>')
              .replace(/'<a'/g, '<deepLink')
              .replace(/'<\/a>'/g, '</deepLink>')
          }`,
          `target_lang=${toLocale.split('_').shift()}`,
          `source_lang=${this.config.defaultLanguage}`,
          'preserve_formatting=1',
          'tag_handling=xml',
          'ignore_tags=deepSkip',
          this.config?.translatorOptions?.formality && `formality=${this.config.translatorOptions.formality}`
        ].filter(Boolean)

        const { status, data: { translations } } = await axios.get<any>(url.join('&'))

        if (status === 429) {
          logger.warn('To many requests, wait and retry')

        } else if (status === 456) {
          throw new Error('Rate limit!')
        }

        return {
          key: message.key,
          value: translations[0].text
            .replace(/<deepSkip>/g, '{')
            .replace(/<\/deepSkip>/g, '}')
            .replace(/<deepLink/g, '\'<a\'')
            .replace(/<\/deepLink>/g, '\'</a>\'')
        }
      }, {
        concurrency: 1,
        stopOnError: true
      }
    )
  }

}
