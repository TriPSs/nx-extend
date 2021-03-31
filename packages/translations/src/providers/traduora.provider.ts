import { resolve } from 'path'
import { readFileSync } from 'fs'
import BaseProvider, { ExtractSettings } from './base.provider'

export interface TraduoraConfig extends ExtractSettings {

  baseUrl: string

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
    console.warn('Not implemented yet')
  }

  public async push() {
    console.warn('Not implemented yet')
  }

  public getConfigFile(): Promise<TraduoraConfig> {
    return JSON.parse(readFileSync(resolve(this.projectRoot, '.traduorarc.json'), 'utf8'))
  }

}
