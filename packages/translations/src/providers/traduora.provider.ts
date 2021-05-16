import { resolve } from 'path'
import { readFileSync, createReadStream, writeFileSync, unlinkSync } from 'fs'
import BaseProvider, { ExtractSettings } from './base.provider'
import axios from 'axios'
import * as FormData from 'form-data'
import { injectProjectRoot } from '../utils'
import { getTranslator } from '../translators'

export interface TraduoraConfig extends ExtractSettings {

  baseUrl: string

  projectId: string

  clientId: string

  clientSecret: string

  outputLocals?: string

  translator?: string

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
    const token = await this.getToken()

    this.context.logger.info('Uploading file to Traduora')
    const locals = await this.getLocals(token)

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

    const terms = await this.getTerms(token)

    const defaultTerms = await this.getDefaultTerms(token)

    await Promise.all(locals.map(async ({ locale: { code, language } }) => {
      if (code !== this.config.defaultLocale) {
        this.context.logger.info(`Pulling ${language}`)

        const writeTo = resolve(
          injectProjectRoot(this.config.outputDirectory, this.projectRoot, this.context.workspaceRoot),
          `${code}.json`
        )

        try {
          const languageTerms = await this.getLanguageTerms(token, code)

          const translatedData = defaultTerms.reduce((newTranslations, defaultTerm) => {
            const term = terms.find((term) => (
              term.id === defaultTerm.termId
            ))

            const translationTerm = languageTerms.find((term) => (
              term.termId === defaultTerm.termId
            ))

            return {
              ...newTranslations,
              [term.value]: translationTerm?.value || defaultTerm?.value || ''
            }
          }, {})

          this.writeLocaleToFile(writeTo, translatedData)

        } catch (err) {
          this.context.logger.error(`Error pulling the ${language} language`)
          console.error(err.message)
        }
      }
    }))
  }

  public async push() {
    const token = await this.getToken()

    await this.uploadLocale(
      token,
      this.config.defaultLocale,
      injectProjectRoot(this.sourceFile, this.projectRoot, this.context.workspaceRoot)
    )

    this.context.logger.info('Translations uploaded!')
  }

  public async translate() {
    const translator = getTranslator(this.config.translator, this.context)

    if (!translator) {
      throw new Error('No translator!')
    }

    const token = await this.getToken()

    this.context.logger.info('Fetch all locals')
    const locals = await this.getLocals(token)

    this.context.logger.info('Fetch all terms')
    const terms = await this.getTerms(token)

    this.context.logger.info('Fetch all fallback terms')
    const defaultTerms = await this.getDefaultTerms(token)

    await Promise.all(locals.map(async ({ locale: { code, language } }) => {
      if (code !== this.config.defaultLocale) {
        this.context.logger.info(`Translating ${language}`)

        const writeTo = resolve(
          injectProjectRoot(this.config.outputDirectory, this.projectRoot, this.context.workspaceRoot),
          `${code}.json`
        )

        const languageTerms = await this.getLanguageTerms(token, code)

        const toTranslate = []

        defaultTerms.forEach((defaultTerm) => {
          const term = terms.find((term) => (
            term.id === defaultTerm.termId
          ))

          const languageTerm = languageTerms.find((term) => (
            term.termId === defaultTerm.termId
          ))

          if (!languageTerm) {
            toTranslate.push({
              key: term.value,
              value: defaultTerm.value
            })
          }
        })

        this.context.logger.info(`${toTranslate.length} terms in need of translating`)

        const translatorTerms = await translator.translate(toTranslate.slice(0, 30), this.config.defaultLocale, code)
        const translatedTerms = {}

        translatorTerms.map((translatorTerm) => {
          translatedTerms[translatorTerm.key] = translatorTerm.value
        })

        const existingTerms = JSON.parse(readFileSync(writeTo, 'utf8'))

        const tempFile = `${writeTo}.tmp`

        // Merge translated terms with existing
        this.writeLocaleToFile(writeTo, {
          ...existingTerms,
          ...translatedTerms
        })

        this.writeLocaleToFile(tempFile, translatedTerms)
        await this.uploadLocale(token, code, tempFile)

        // Remove the tmp file
        unlinkSync(tempFile)
      }
    }))
  }

  public getConfigFile(): Promise<TraduoraConfig> {
    return JSON.parse(readFileSync(resolve(this.projectRoot, '.traduorarc.json'), 'utf8'))
  }

  private async getToken(): Promise<string> {
    this.context.logger.info('Fetching token from Traduora')

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

  private async getTerms(token) {
    const { data: { data: terms } } = await axios.get(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/terms`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    return terms
  }

  private async getDefaultTerms(token) {
    return this.getLanguageTerms(token, this.config.defaultLocale)
  }

  private async getLanguageTerms(token: string, code: string) {
    const { data: { data: terms } } = await axios.get(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/translations/${code}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    return terms
  }

  private async getLocals(token) {
    const { data: { data: locals } } = await axios.get(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/translations`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    return locals
  }

  private async uploadLocale(token, locale, sourceFile) {
    const form = new FormData()

    form.append('file', createReadStream(sourceFile))

    this.context.logger.info(`Uploading ${locale} to Traduora`)
    await axios.post(
      `${this.config.baseUrl}/api/v1/projects/${this.config.projectId}/imports?format=jsonflat&locale=${locale}`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...form.getHeaders()
        }
      }
    )

  }

  private writeLocaleToFile(location, translatedData) {
    writeFileSync(
      location,
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
  }
}
