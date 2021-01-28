import { resolve } from 'path'
import { readFileSync } from 'fs'
import BaseProvider, { ExtractSettings } from './base.provider'

export interface TraduoraConfig {

  'base-url': string

  locale: string

  locales: string[]

}

export default class Traduora extends BaseProvider<TraduoraConfig> {

  getExtractSettings(): ExtractSettings {
    return {
      languages: this.config.locales,
      defaultLocale: this.config.locale
    }
  }

  public async pull() {
    console.warn('Not implemented yet')
  }

  public async push() {
    console.warn('Not implemented yet')
  }

  public getConfigFile(): Promise<TraduoraConfig> {
    return JSON.parse(readFileSync(resolve(this.projectRoot, '.traduorarc.json'), 'utf8'))
  }

}
