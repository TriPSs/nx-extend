import axios from 'axios'
import * as pMap from 'p-map'

export interface Message {

  key: string

  value: string

}

export default class DeeplTranslator {

  private readonly apiKey = process.env.DEEPL_API_KEY

  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
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
          'ignore_tags=deepSkip'
        ]

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
