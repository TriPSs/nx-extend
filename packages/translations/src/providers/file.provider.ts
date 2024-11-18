import { BaseConfigFile } from '../utils/config-file'
import BaseProvider from './base.provider'

export default class File extends BaseProvider<BaseConfigFile> {

  public async getTranslations(language: string): Promise<{ [key: string]: string }> {
    return {}
  }

  public async uploadTranslations(language: string, translations: { [key: string]: string }): Promise<boolean> {
    return true
  }

  protected assureRequirementsExists(): Promise<void> {
    return Promise.resolve(undefined)
  }

}
