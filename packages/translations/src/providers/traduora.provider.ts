import { resolve } from 'path'
import { readFileSync } from 'fs'
import BaseProvider, { ExtractSettings } from './base.provider'

export interface TraduoraConfig {

  'base-url': string

  locale: string

  locales: string[]

}

export default new (class Traduora extends BaseProvider {

  getExtractSettings(projectRoot: string): ExtractSettings {
    const configFile = this.getConfigFile(projectRoot)

    return {
      languages: configFile.locales,
      defaultLocale: configFile.locale
    }
  }

  private getConfigFile(projectRoot: string): TraduoraConfig {
    return JSON.parse(readFileSync(resolve(projectRoot, '.traduorarc.json'), 'utf8'))
  }

})()
