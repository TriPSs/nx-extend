import { resolve } from 'path'
import { readFileSync, createReadStream, writeFileSync } from 'fs'
import BaseProvider, { ExtractSettings } from './base.provider'
import axios from 'axios'
import * as FormData from 'form-data'
import { injectProjectRoot } from '../utils'

export interface TraduoraConfig extends ExtractSettings {

  baseUrl: string

  projectId: string

  clientId: string

  clientSecret: string

  outputLocals?: string

}

export default class Traduora extends BaseProvider<TraduoraConfig> {

  getExtractSettings(): ExtractSettings {
    return {
      defaultLocale: this.config.defaultLocale,
      outputDirectory: this.config.outputDirectory,
      extractor: this.config.extractor
    }
  }

  public async pull() {
    this.context.logger.info('Fetching token from Traduora')
    const token = await this.getToken()

    this.context.logger.info('Uploading file to Traduora')
    const { data: { data: locals } } = await axios.get(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/translations`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    // If outputLocals is defined then store the locals there
    if (this.config.outputLocals) {
      writeFileSync(
        injectProjectRoot(this.config.outputLocals, this.projectRoot, this.context.workspaceRoot),
        JSON.stringify(
          locals.map(({ locale }) => ({
              code: locale.code,
              language: locale.language
            })
          ), null, 2)
      )
    }

    const { data: { data: terms } } = await axios.get(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/terms`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    const { data: { data: fallbackTerms } } = await axios.get(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/translations/${this.config.defaultLocale}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    await Promise.all(locals.map(async ({ locale: { code, language } }) => {
      if (code !== this.config.defaultLocale) {
        this.context.logger.info(`Pulling ${language}`)

        const writeTo = resolve(
          injectProjectRoot(this.config.outputDirectory, this.projectRoot, this.context.workspaceRoot),
          `${code}.json`
        )

        try {
          const { data: { data: translatedTerms } } = await axios.get(
            `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/translations/${code}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )

          const translatedData = translatedTerms.reduce((newTranslations, translation) => {
            const term = terms.find((term) => (
              term.id === translation.termId
            ))

            const fallback = fallbackTerms.find((term) => (
              term.termId === translation.termId
            ))

            return {
              ...newTranslations,
              [term.value]: translation.value || fallback.value
            }
          }, {})

          writeFileSync(
            writeTo,
            JSON.stringify(
              Object.keys(translatedData)
                .sort()
                .reduce((sortedTranslations, key) => {
                  sortedTranslations[key] = translatedData[key]

                  return sortedTranslations
                }, {}),
              null,
              2
            )
          )
        } catch (err) {
          this.context.logger.error(`Error pulling the ${language} language`, err.message || err)
        }
      }
    }))
  }

  public async push() {
    const form = new FormData()

    form.append('file', createReadStream(
      injectProjectRoot(this.sourceFile, this.projectRoot, this.context.workspaceRoot)
    ))

    this.context.logger.info('Fetching token from Traduora')
    const token = await this.getToken()

    this.context.logger.info('Uploading file to Traduora')
    await axios.post(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/imports?format=jsonflat&locale=${this.config.defaultLocale}`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...form.getHeaders()
        }
      }
    )

    this.context.logger.info('Translations uploaded!')
  }

  public getConfigFile(): Promise<TraduoraConfig> {
    return JSON.parse(readFileSync(resolve(this.projectRoot, '.traduorarc.json'), 'utf8'))
  }

  private async getToken(): Promise<string> {
    const { data } = await axios.post(
      `${this.config.baseUrl}/api/v1/auth/token`,
      {
        'grant_type': 'client_credentials',
        'client_id': this.config.clientId,
        'client_secret': this.config.clientSecret
      }
    )

    return data.access_token
  }

}
