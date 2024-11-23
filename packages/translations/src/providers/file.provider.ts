import { readJsonFile } from '@nx/devkit'
import { existsSync } from 'fs'
import { join } from 'path'

import { injectProjectRoot } from '../utils'
import { BaseConfigFile } from '../utils/config-file'
import BaseProvider from './base.provider'

export default class File extends BaseProvider<BaseConfigFile> {

  public async getTranslations(language: string): Promise<{ [key: string]: string }> {
    const fileLocation = injectProjectRoot(
      join(this.config.outputDirectory, `${language}.json`),
      this.config.projectRoot,
      this.context.root
    )

    if (!existsSync(fileLocation)) {
      return {}
    }

    return readJsonFile(fileLocation)
  }

  public async uploadTranslations(language: string, translations: { [key: string]: string }): Promise<boolean> {
    return true
  }

  protected assureRequirementsExists(): Promise<void> {
    return Promise.resolve(undefined)
  }

}
