import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import axios from 'axios'
import * as deepmerge from 'deepmerge'

import { injectProjectRoot } from '../utils'
import { BaseConfigFile } from '../utils/config-file'
import BaseProvider from './base.provider'

export interface TransifexConfig extends BaseConfigFile {

  organization: string

  project: string

  recourse: string

  token?: string

  createResourceIfNeeded?: boolean

}

export default class Transifex extends BaseProvider<TransifexConfig> {

  private readonly apiClient = axios.create({
    baseURL: 'https://rest.api.transifex.com'
  })

  /**
   * Pull translations from Transifex
   */
  public async pull(): Promise<void> {
    const project = `o:${this.config.organization}:p:${this.config.project}`
    const resource = `o:${this.config.organization}:p:${this.config.project}:r:${this.config.recourse}`

    const { data: languages } = await this.getFromAPI(
      '/resource_language_stats',
      {
        'filter[project]': project,
        'filter[resource]': resource
      }
    )

    await Promise.all(languages.map(async (language) => {
      const languageId = language.relationships.language.data.id
      const languageString = languageId.split(':').pop()
      const writeTo = resolve(
        injectProjectRoot(
          this.config.outputDirectory,
          this.config.projectRoot,
          this.context.workspaceRoot
        ),
        `${languageString}.json`
      )

      if (languageString === this.config.defaultLanguage) {
        // Skip pulling the source file
        return
      }

      this.context.logger.info(`Pulling ${languageString}`)

      try {
        const { data: translations, included: source } = await this.getFromAPI(
          '/resource_translations',
          {
            'filter[resource]': resource,
            'filter[language]': languageId,
            'include': 'resource_string'
          }
        )

        const translatedData = translations.reduce((newTranslations, translation) => {
          const sourceKey = source.find((sour) => {
            return sour.id === translation.relationships.resource_string.data.id
          })

          return {
            ...newTranslations,
            [sourceKey.attributes.key.split('\\.').join('.')]: translation?.attributes?.strings?.other || sourceKey.attributes.strings.other
          }
        }, {})

        writeFileSync(
          writeTo,
          JSON.stringify(translatedData, null, 2)
        )
      } catch (err) {
        this.context.logger.error(`Error pulling ${languageString}`, err.message || err)
      }
    }))
  }

  /**
   * Push the source file to Transifex
   */
  public async push(): Promise<void> {
    const resource = `o:${this.config.organization}:p:${this.config.project}:r:${this.config.recourse}`
    const sourceFileContent = readFileSync(this.sourceFile, 'utf8')
    const sourceFileMinified = JSON.stringify(JSON.parse(sourceFileContent))

    try {
      return await this.uploadResourceFile(sourceFileMinified, resource)

    } catch (err) {
      if (err.response.status !== 404 && !this.config.createResourceIfNeeded) {
        throw err
      }
    }

    // Try to create the recourse and then upload it again
    this.context.logger.info(`Recourse did not exist, going to create "${this.config.recourse}"`)
    await this.createResource()

    this.context.logger.info('Retrying upload source file')
    await this.uploadResourceFile(sourceFileMinified, resource)
  }

  public async translate() {
    console.warn('Not yet implemented!')
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
    if (links.next) {
      const additionalData = await this.getFromAPI(links.next)

      finalResponse = deepmerge(response, additionalData)
    }

    return finalResponse
  }

  private createResource() {
    return this.postToAPI(
      '/resources',
      {
        data: {
          attributes: {
            name: this.config.recourse,
            slug: this.config.recourse
          },
          relationships: {
            i18n_format: {
              data: {
                id: 'KEYVALUEJSON',
                type: 'i18n_formats'
              }
            },
            project: {
              data: {
                id: `o:${this.config.organization}:p:${this.config.project}`,
                type: 'projects'
              }
            }
          },
          type: 'resources'
        }
      }
    )
  }

  private uploadResourceFile(sourceFileMinified: string, resource: string) {
    return this.postToAPI(
      '/resource_strings_async_uploads',
      {
        data: {
          attributes: {
            content: `${sourceFileMinified}`,
            content_encoding: 'text'
          },
          relationships: {
            resource: {
              data: {
                id: resource,
                type: 'resources'
              }
            }
          },
          type: 'resource_strings_async_uploads'
        }
      }
    )
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

  private getToken(): string {
    const token = this.config.token || process.env.TX_TOKEN

    if (!token) {
      throw new Error('No token provided! Add "TX_TOKEN" to your environment variables!')
    }

    return token
  }

  getTranslations(language: string): Promise<{ [p: string]: string }> {
    return Promise.resolve({});
  }

  uploadTranslations(language: string, translations: { [p: string]: string }): Promise<boolean> {
    return Promise.resolve(false);
  }

  protected assureRequirementsExists(): Promise<void> {
    return Promise.resolve(undefined);
  }

}
