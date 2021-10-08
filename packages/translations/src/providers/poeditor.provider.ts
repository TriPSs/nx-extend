import axios from 'axios'
import * as FormData from 'form-data'
import { existsSync } from 'fs'

import BaseProvider from './base.provider'
import { BaseConfigFile, updateConfigFile } from '../utils/config-file'

export type PoeditorConfig = BaseConfigFile

export default class Poeditor extends BaseProvider<PoeditorConfig> {

  private readonly apiClient = axios.create({
    baseURL: 'https://api.poeditor.com/v2'
  })

  public async push() {
    await this.assureRequirementsExists()

    if (!existsSync(this.sourceFile)) {
      throw new Error('Source file does not exist!')
    }

    this.context.logger.info('Going to upload translations!')

    const sourceTerms = this.getSourceTerms()

    const terms = []
    Object.keys(sourceTerms).forEach((key) => {
      terms.push({
        term: key
      })
    })

    let form = new FormData()
    form.append('api_token', this.getToken())
    form.append('id', this.config.projectId)
    form.append('data', JSON.stringify(terms))

    await this.apiClient.post(
      '/projects/sync',
      form,
      {
        headers: form.getHeaders()
      }
    )

    await this.uploadTranslations(this.config.defaultLanguage, sourceTerms)
  }

  public async getTranslations(language: string): Promise<{ [key: string]: string }> {
    const form = new FormData()
    form.append('api_token', this.getToken())
    form.append('id', this.config.projectId)
    form.append('language', language)

    const translations: { [key: string]: string } = {}

    const { data } = await this.apiClient.post(
      '/terms/list',
      form,
      {
        headers: form.getHeaders()
      }
    )

    data.result.terms.forEach(({ term, translation }) => {
      translations[term] = translation.content
    })

    return translations
  }

  public async uploadTranslations(language: string, translations: { [key: string]: string }): Promise<boolean> {
    this.context.logger.info(`Adding translations to "${this.config.defaultLanguage}" language`)

    const data = []
    Object.keys(translations).forEach((key) => {
      data.push({
        term: key,
        translation: {
          content: translations[key]
        }
      })
    })

    const form = new FormData()
    form.append('api_token', this.getToken())
    form.append('id', this.config.projectId)
    form.append('language', language)
    form.append('data', JSON.stringify(data))

    await this.apiClient.post(
      '/translations/add',
      form,
      {
        headers: form.getHeaders()
      }
    )

    this.context.logger.info('Translations uploaded!')

    return true
  }

  protected async assureRequirementsExists() {
    await this.assureProjectExists()
    await this.assureLanguageExists()
  }

  private async assureProjectExists() {
    if (this.config.projectId) {
      return true
    }

    if (!this.config.projectName) {
      throw new Error('No "projectName" or "projectId" provided!')
    }

    let form = new FormData()
    form.append('api_token', this.getToken())

    const { data: { result: { projects } } } = await this.apiClient.post(
      '/projects/list',
      form,
      {
        headers: form.getHeaders()
      }
    )

    let project = projects.find((project) => project.name === this.config.projectName)

    if (!project) {
      this.context.logger.info(`Project "${this.config.projectName}" does not exist, going to create it!`)

      form = new FormData()
      form.append('api_token', this.getToken())
      form.append('name', this.config.projectName)

      const { data: { result } } = await this.apiClient.post(
        '/projects/add',
        form,
        {
          headers: form.getHeaders()
        }
      )

      project = result.project

      form = new FormData()
      form.append('api_token', this.getToken())
      form.append('id', project.id)
      form.append('reference_language', this.config.defaultLanguage)

      await this.apiClient.post(
        '/projects/add',
        form,
        {
          headers: form.getHeaders()
        }
      )

    } else {
      this.context.logger.info(`Found "${this.config.projectName}" project, storing id in config`)
    }

    // Update the config file
    await updateConfigFile(this.context, {
      projectId: project.id
    })

    // Update the current config
    this.config = Object.assign(this.config, {
      projectId: project.id
    })
  }

  private async assureLanguageExists() {
    if (!this.config.languages || this.config.languages.length === 0) {
      throw new Error('No "languages" defined!')
    }

    const form = new FormData()
    form.append('api_token', this.getToken())
    form.append('id', this.config.projectId)

    const { data: { result: { languages } } } = await this.apiClient.post(
      '/languages/list',
      form,
      {
        headers: form.getHeaders()
      }
    )

    const existingCodes = languages.map((language) => language.code)
    const nonExistingCodes = [...this.config.languages]
      .filter((code) => !existingCodes.includes(code))

    while (nonExistingCodes.length > 0) {
      const code = nonExistingCodes.shift()
      this.context.logger.info(`Going add language "${code}" to project "${this.config.projectName}"`)

      const form = new FormData()
      form.append('api_token', this.getToken())
      form.append('id', this.config.projectId)
      form.append('language', code)

      const { data: { response: { status } } } = await this.apiClient.post(
        '/languages/add',
        form,
        {
          headers: form.getHeaders()
        }
      )

      if (status !== 'success') {
        throw new Error(`Could not create language with code "${code}"`)
      }
    }
  }

  private getToken(): string {
    const apiKey = process.env.NX_EXTEND_POEDITOR_KEY

    if (!apiKey) {
      throw new Error('No API key defined, please set "NX_EXTEND_POEDITOR_KEY"!')
    }

    return apiKey
  }

}
