import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { BuilderContext } from '@angular-devkit/architect'
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

export const getFile = (projectRoot, location) => {
  const fileLocation = resolve(projectRoot, location)

  if (existsSync(fileLocation)) {
    return JSON.parse(readFileSync(fileLocation, 'utf8'))
  }

  return {}
}

export const getConfigFile = async <Config extends BaseConfigFile>(context: BuilderContext): Promise<Config> => {
  const projectRoot = await getProjectRoot(context)

  let configFile = getFile(projectRoot, '.translationsrc.json') as Config

  if (configFile.extends) {
    configFile = Object.assign(
      getFile(projectRoot, configFile.extends),
      configFile
    )
  }

  // Add project root to the config
  configFile = Object.assign(configFile, {
    projectRoot
  })

  return configFile as Config
}


export const updateConfigFile = async <Config extends BaseConfigFile>(context: BuilderContext, update): Promise<void> => {
  const projectRoot = await getProjectRoot(context)
  const configFile = getFile(projectRoot, '.translationsrc.json') as Config
  const fileLocation = resolve(projectRoot, '.translationsrc.json')

  writeFileSync(fileLocation, JSON.stringify(
    Object.assign(configFile, update),
    null,
    2
  ))
}
