import { ExecutorContext, writeJsonFile, readJsonFile } from '@nrwl/devkit'
import { resolve } from 'path'

import { getProjectRoot } from './get-project-root'

export type Extractors = 'formatjs'

export interface BaseConfigFile {

  projectRoot: string

  extends?: string

  provider?: 'transifex' | 'tranduora' | 'poeditor'

  projectName: string

  projectId?: number

  defaultLanguage: string

  skipDefaultLanguage?: boolean

  outputDirectory?: string

  outputLanguages?: string

  extractor?: Extractors

  translator?: 'free-deepl' | 'deepl'

  translatorOptions?: {
    /**
     * Sets whether the translated text should lean towards formal or informal language. This feature
     * currently only works for target languages
     * - "DE" (German)
     * - "FR" (French
     * - "IT" (Italian)
     * - "ES" (Spanish)
     * - "NL" (Dutch)
     * - "PL" (Polish)
     * - "PT-PT"
     * - "PT-BR" (Portuguese)
     * - "RU" (Russian)
     *
     * Possible options are:
     * "default" (default)
     * "more" - for a more formal language
     * "less" - for a more informal language
     */
    formality?: 'default' | 'more' | 'less'
  }

  languages: string[]

}

export const getConfigFile = <Config extends BaseConfigFile>(context: ExecutorContext): Config => {
  let configFile = readJsonFile<Config>(
    resolve(getProjectRoot(context), '.translationsrc.json')
  )

  if (configFile.extends) {
    configFile = Object.assign(
      readJsonFile(resolve(getProjectRoot(context), configFile.extends)),
      configFile
    )
  }

  // Add project root to the config
  configFile = Object.assign(configFile, {
    projectRoot: getProjectRoot(context)
  })

  return configFile as Config
}


export const updateConfigFile = (context: ExecutorContext, update): void => {
  const fileLocation = resolve(getProjectRoot(context), '.translationsrc.json')

  writeJsonFile(fileLocation, Object.assign(readJsonFile(fileLocation), update))
}
