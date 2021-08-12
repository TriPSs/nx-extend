import axios from 'axios'
import * as pMap from 'p-map'

export interface Message {

  key: string

  value: string

}

export interface Options {

  /**
   * Sets whether the translated text should lean towards formal or informal language. This feature
   * currently only works for target languages
   * - "DE" (German)
   * - "FR" (French
   * - "IT" (Italian)
   * - "ES" (Spanish)
   * - "NL" (Dutch)
   * - "PL" (Polish)
   * - "PT-PT"
   * - "PT-BR" (Portuguese)
   * - "RU" (Russian)
   *
   * Possible options are:
   * "default" (default)
   * "more" - for a more formal language
   * "less" - for a more informal language
   */
  formality?: 'default' | 'more' | 'less'

}

export default class DeeplTranslator {

  private readonly apiKey = process.env.DEEPL_API_KEY

  private readonly endpoint: string

  private readonly options: Options

  constructor(endpoint: string, options: Options) {
    this.endpoint = endpoint
    this.options = options
  }

  public async translate(messages: Message[], fromLocale: string, toLocale: string) {
    if (!this.apiKey) {
      throw new Error('No "DEEPL_API_KEY" defined!')
    }

    return pMap(
      messages,
      async (message, index) => {
        console.log(`Translating message ${index + 1} of ${messages.length}`)

        const url = [
          `${this.endpoint}/v2/translate?`,
          `auth_key=${this.apiKey}`,
          `text=${
            message.value
              .replace(/{/g, '<deepSkip>')
              .replace(/}/g, '</deepSkip>')
          }`,
          `target_lang=${toLocale}`,
          `source_lang=${fromLocale}`,
          'preserve_formatting=1',
          'tag_handling=xml',
          'ignore_tags=deepSkip',
          this.options.formality && `formality=${this.options.formality}`
        ].filter(Boolean)

        const { status, data: { translations } } = await axios.get(url.join('&'))

        if (status === 429) {
          console.log('to many, wait and retry')

        } else if (status === 456) {
          throw new Error('Rate limit!')
        }

        return {
          key: message.key,
          value: translations[0].text
            .replace(/<deepSkip>/g, '{')
            .replace(/<\/deepSkip>/g, '}')
        }
      }, {
        concurrency: 1,
        stopOnError: true
      }
    )
  }

}
