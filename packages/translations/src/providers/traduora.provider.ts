import axios, { AxiosInstance } from 'axios'
import * as FormData from 'form-data'

import BaseProvider from './base.provider'
import { BaseConfigFile, updateConfigFile } from '../utils/config-file'

export interface TraduoraConfig extends BaseConfigFile {

  baseUrl: string

}

export default class Traduora extends BaseProvider<TraduoraConfig> {

  private apiClient: AxiosInstance

  private token = null

  public async getTranslations(code: string): Promise<{ [key: string]: string }> {
    const { data: { data: terms } } = await this.apiClient.get<any>(
      `/api/v1/projects/${this.config.projectId}/terms`
    )

    const { data: { data } } = await this.apiClient.get<any>(
      `/api/v1/projects/${this.config.projectId}/translations/${code}`
    )

    const translations = {}

    terms.forEach((term) => {
      const translation = data.find(({ termId }) => termId === term.id)

      translations[term.value] = translation?.value ?? ''
    })

    return translations
  }

  public async uploadTranslations(language: string, translations: { [p: string]: string }): Promise<boolean> {
    const form = new FormData()

    form.append('file', Buffer.from(JSON.stringify(translations)), {
      filename: `${language}.json`
    })

    this.context.logger.info(`Uploading ${language} to Traduora`)
    await this.apiClient.post(
      `/api/v1/projects/${this.config.projectId}/imports?format=jsonflat&locale=${language}`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${await this.getToken()}`,
          ...form.getHeaders()
        }
      }
    )

    return true
  }

  protected async assureRequirementsExists() {
    await this.assureApiClientExists()
    await this.assureProjectExists()
    await this.assureLanguageExists()
  }

  private async assureApiClientExists() {
    if (!this.config.baseUrl) {
      throw new Error('No "baseUrl" defined in config!')
    }

    this.apiClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${await this.getToken()}`
      }
    })
  }

  private async assureProjectExists() {
    if (this.config.projectId) {
      return true
    }

    if (!this.config.projectName) {
      throw new Error('No "projectName" or "projectId" provided!')
    }

    const { data: { data } } = await this.apiClient.get<any>('/api/v1/projects')

    let project = data.find((project) => project.name === this.config.projectName)

    if (!project) {
      this.context.logger.info(`Project "${this.config.projectName}" does not exist, going to create it!`)

      const { data: { data: { id } } } = await this.apiClient.post<any>('/api/v1/projects', {
        name: this.config.projectName
      })

      project = {
        id
      }

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

    const { data: { data } } = await this.apiClient.get<any>(`/api/v1/projects/${this.config.projectId}/translations`)

    const existingCodes = data.map(({ locale }) => locale.code)

    const nonExistingCodes = [...this.config.languages]
      .filter((code) => !existingCodes.includes(code))

    while (nonExistingCodes.length > 0) {
      const code = nonExistingCodes.shift()
      this.context.logger.info(`Going add language "${code}" to project "${this.config.projectName}"`)

      await this.apiClient.post(`/api/v1/projects/${this.config.projectId}/translations`, {
        code
      })
    }
  }

  private async getToken(): Promise<string> {
    if (this.token) {
      return this.token
    }

    this.context.logger.info('Fetching token from Traduora')

    const username = process.env.NX_EXTEND_TRADUORA_USERNAME
    const password = process.env.NX_EXTEND_TRADUORA_PASSWORD

    if (!username) {
      throw new Error('No username provided! Add "NX_EXTEND_TRADUORA_USERNAME" to your environment variables!')
    }

    if (!password) {
      throw new Error('No password provided! Add "NX_EXTEND_TRADUORA_PASSWORD" to your environment variables!')
    }

    const { data } = await axios.post<{ access_token: string }>(
      `${this.config.baseUrl}/api/v1/auth/token`,
      {
        grant_type: 'password',
        username,
        password
      }
    )

    return this.token = data.access_token
  }

}
