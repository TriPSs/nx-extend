import { BuilderContext } from '@angular-devkit/architect'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { BaseConfigFile } from '../utils/config-file'
import { injectProjectRoot } from '../utils'
import { getTranslator } from '../translators'

export default abstract class BaseProvider<Config extends BaseConfigFile> {

  protected readonly context: BuilderContext

  protected projectMetadata = null

  protected config: Config = null

  protected sourceFile: string = null

  constructor(context: BuilderContext, config: Config) {
    this.context = context
    this.config = config

    this.sourceFile = injectProjectRoot(
      join(
        this.config.outputDirectory,
        `${this.config.defaultLanguage}.json`
      ),
      this.config.projectRoot,
      this.context.workspaceRoot
    )
  }

  protected abstract assureRequirementsExists(): Promise<void>

  public async pull() {
    await this.assureRequirementsExists()

    // All the languages
    const languages = [...this.config.languages]

    // If outputLocals is defined then store the locals there
    if (this.config.outputLanguages) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

      this.writeToFile(this.config.outputLanguages, languages.map((code) => ({
        code,
        language: languageNames.of(code)
      })))
    }

    // Source terms
    const sourceTerms = this.getSourceTerms()

    while (languages.length > 0) {
      const code = languages.shift()

      if (this.config.skipDefaultLanguage && code === this.config.defaultLanguage) {
        continue
      }

      this.context.logger.info(`Pulling "${code}"`)

      const terms = await this.getTranslations(code)

      const translations = {}
      Object.keys(terms)
        .forEach((term) => {
          let content = terms[term]

          // If term is not defined use the source term
          if (!content || content.length === 0) {
            content = sourceTerms[term]
          }

          translations[term] = content
        })

      await this.writeLocaleToFile(code, translations)
    }
  }

  public async push(): Promise<void> {
    await this.assureRequirementsExists()

    if (!existsSync(this.sourceFile)) {
      throw new Error('Source file does not exist!')
    }

    const sourceTerms = this.getSourceTerms()

    this.context.logger.info(`Going to upload ${sourceTerms} source terms!`)

    await this.uploadTranslations(this.config.defaultLanguage, sourceTerms)
  }

  public async translate() {
    const translator = getTranslator(this.context, this.config)

    if (!translator) {
      throw new Error('No translator!')
    }

    await this.assureRequirementsExists()

    await translator.translateAll(this)
  }

  public abstract getTranslations(language: string): Promise<{ [key: string]: string }>

  public abstract uploadTranslations(language: string, translations: { [key: string]: string }): Promise<boolean>

  public getSourceTerms() {
    return JSON.parse(readFileSync(this.sourceFile, 'utf8'))
  }

  public getLanguageTerms(language: string) {
    const fileLocation = injectProjectRoot(
      `${this.config.outputDirectory}/${language}.json`,
      this.config.projectRoot,
      this.context.workspaceRoot
    )

    if (!existsSync(fileLocation)) {
      return {}
    }

    return JSON.parse(readFileSync(fileLocation, 'utf8'))
  }

  protected writeToFile(to, data) {
    writeFileSync(
      injectProjectRoot(to, this.config.projectRoot, this.context.workspaceRoot),
      JSON.stringify(data, null, 2)
    )
  }

  public writeLocaleToFile(language, translatedData) {
    this.writeToFile(
      `${this.config.outputDirectory}/${language}.json`,
      Object.keys(translatedData)
        .sort()
        .reduce((sortedTranslations, key) => {
          sortedTranslations[key] = translatedData[key]

          return sortedTranslations
        }, {})
    )
  }

}
