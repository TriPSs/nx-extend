import { logger } from '@nrwl/devkit'
import axios, { AxiosInstance } from 'axios'
import { existsSync } from 'fs'

import BaseProvider from './base.provider'
import { BaseConfigFile } from '../utils/config-file'

export interface SimpleLocalizeConfig extends BaseConfigFile {
  tokenFrom?: string
}

export default class SimpleLocalize extends BaseProvider<SimpleLocalizeConfig> {

  private readonly apiClient: AxiosInstance = axios.create({
    baseURL: 'https://api.simplelocalize.io/api/v1'
  })

  public async push() {
    await this.assureRequirementsExists()

    if (!existsSync(this.sourceFile)) {
      throw new Error('Source file does not exist!')
    }

    logger.info('Going to upload translations!')

    const sourceTerms = this.getSourceTerms()

    await this.uploadTranslations(this.config.defaultLanguage, sourceTerms)
  }

  public async getTranslations(language: string): Promise<{ [key: string]: string }> {
    const { data } = await this.apiClient.get<any>(
      `https://cdn.simplelocalize.io/:projectToken/_latest/${language}`
    )

    return data
  }

  public async uploadTranslations(language: string, translations: { [key: string]: string }): Promise<boolean> {
    logger.info(`Adding translations to "${this.config.defaultLanguage}" language`)

    const terms = []
    Object.keys(translations).forEach((key) => {
      terms.push({
        key,
        language,
        text: translations[key]
      })
    })

    await this.apiClient.post(
      '/translations',
      {
        content: terms
      },
      {
        headers: {
          'X-SimpleLocalize-Token': this.getToken()
        }
      }
    )

    logger.info('Translations uploaded!')

    return true
  }

  protected async assureRequirementsExists() {
    // await this.assureProjectExists()
    // await this.assureLanguageExists()
  }

  private getToken(): string {
    const apiKey = this.config.tokenFrom
      ? process.env[this.config.tokenFrom]
      : process.env.NX_EXTEND_SIMPLE_LOCALIZE_TOKEN

    if (!apiKey) {
      throw new Error(`No API key defined, please set "${this.config.tokenFrom || 'NX_EXTEND_SIMPLE_LOCALIZE_TOKEN'}"!`)
    }

    return apiKey
  }

}
