import axios from 'axios'
import * as deepmerge from 'deepmerge'

import { BaseConfigFile } from '../utils/config-file'
import BaseProvider from './base.provider'

export interface TransifexConfig extends BaseConfigFile {

  organization: string

  project: string

}

export interface TransifexLanguage {

  id: string

  code: string

}

export default class Transifex extends BaseProvider<TransifexConfig> {

  private readonly apiClient = axios.create({
    baseURL: 'https://rest.api.transifex.com'
  })

  private languages: TransifexLanguage[] = []

  public async getTranslations(language: string): Promise<{ [p: string]: string }> {
    const transifexLanguage = this.languages.find(({ code }) => code === language)

    if (!transifexLanguage) {
      this.context.logger.error(`Language "${language}" does not exist in Transifex!`)
      return
    }

    const { data: translations, included: source } = await this.getFromAPI(
      '/resource_translations',
      {
        'filter[resource]': this.getRecourseName(true),
        'filter[language]': transifexLanguage.id,
        'include': 'resource_string'
      }
    )

    return translations.reduce((newTranslations, translation) => {
      const sourceKey = source.find((sour) => {
        return sour.id === translation.relationships.resource_string.data.id
      })

      return {
        ...newTranslations,
        [sourceKey.attributes.key.split('\\.').join('.')]: translation?.attributes?.strings?.other || ''
      }
    }, {})
  }

  public async uploadTranslations(language: string, translations: { [p: string]: string }): Promise<boolean> {
    const transifexLanguage = this.languages.find(({ code }) => code === language)

    if (!transifexLanguage && language === this.config.defaultLanguage) {
      this.context.logger.error(`Language "${language}" does not exist in Transifex!`)
      return
    }

    let response
    // If its the default language then upload the source terms
    if (language === this.config.defaultLanguage) {
      response = await this.postToAPI(
        '/resource_strings_async_uploads',
        {
          data: {
            attributes: {
              content: `${JSON.stringify(translations)}`,
              content_encoding: 'text'
            },
            relationships: {
              resource: {
                data: {
                  id: this.getRecourseName(true),
                  type: 'resources'
                }
              }
            },
            type: 'resource_strings_async_uploads'
          }
        }
      )
    } else {
      response = await this.postToAPI(
        '/resource_translations_async_uploads',
        {
          data: {
            attributes: {
              content: `${JSON.stringify(translations)}`,
              content_encoding: 'text',
              file_type: 'default'
            },
            relationships: {
              language: {
                data: {
                  id: transifexLanguage.id,
                  type: 'languages'
                }
              },
              resource: {
                data: {
                  id: this.getRecourseName(true),
                  type: 'resources'
                }
              }
            },
            type: 'resource_translations_async_uploads'
          }
        }
      )
    }

    let tries = 0
    let status = response.data.attributes.status
    while (status !== 'succeeded' && tries <= 3) {
      this.context.logger.info('Verify upload status...')
      tries++
      const { data } = await this.getFromAPI(response.data.links.self)
      status = data?.attributes?.status

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    if (status !== 'succeeded') {
      this.context.logger.warn(`Could not verify upload status, last know status was "${status}"`)
    }

    return true
  }

  protected async assureRequirementsExists(): Promise<void> {
    await this.assureLanguagesAreSet()
    await this.assureProjectExists()
  }

  private async assureProjectExists() {
    // Try to create the recourse and then upload it again
    // this.context.logger.info(`Recourse did not exist, going to create "${this.config.projectName}"`)
    // return this.postToAPI(
    //   '/resources',
    //   {
    //     data: {
    //       attributes: {
    //         name: this.config.projectName,
    //         slug: this.config.projectName
    //       },
    //       relationships: {
    //         i18n_format: {
    //           data: {
    //             id: 'KEYVALUEJSON',
    //             type: 'i18n_formats'
    //           }
    //         },
    //         project: {
    //           data: {
    //             id: this.getRecourseName(false),
    //             type: 'projects'
    //           }
    //         }
    //       },
    //       type: 'resources'
    //     }
    //   }
    // )
  }

  private async assureLanguagesAreSet() {
    const project = this.getRecourseName(false)
    const resource = this.getRecourseName(true)

    const { data: languages } = await this.getFromAPI(
      '/resource_language_stats',
      {
        'filter[project]': project,
        'filter[resource]': resource
      }
    )

    this.languages = languages.map((language) => ({
      id: language.relationships.language.data.id,
      code: language.relationships.language.data.id
        .split(':')
        .pop()
    }))
  }

  /**
   * Posts to the Transifex API
   */
  private async postToAPI(uri: string, data) {
    const { data: response } = await this.apiClient.post(
      uri,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          'content-type': 'application/vnd.api+json'
        }
      }
    )

    return response
  }

  /**
   * Get's from the Transifex API and if there is a next link also retrieves that
   */
  private async getFromAPI(uri: string, params = {}) {
    const { data: { links, ...response } } = await this.apiClient.get(
      uri,
      {
        params,
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )

    let finalResponse = response

    // If we have more data then retrieve it
    if (links && links.next) {
      const additionalData = await this.getFromAPI(links.next)

      finalResponse = deepmerge(response, additionalData)
    }

    return finalResponse
  }

  private getToken(): string {
    const token = process.env.TX_TOKEN || process.env.NX_TX_TOKEN

    if (!token) {
      throw new Error('No token provided! Add "TX_TOKEN" to your environment variables!')
    }

    return token
  }

  private getRecourseName(withProjectName: boolean): string {
    return [
      `o:${this.config.organization}`,
      `p:${this.config.project}`,
      withProjectName && `r:${this.config.projectName}`
    ].filter(Boolean).join(':')
  }

}
