import {
  ExecutorContext,
  logger,
  readJsonFile,
  writeJsonFile
} from '@nx/devkit'
import { existsSync } from 'fs'
import { join } from 'path'

import { getTranslator } from '../translators'
import { injectProjectRoot } from '../utils'
import { BaseConfigFile } from '../utils/config-file'

export default abstract class BaseProvider<Config extends BaseConfigFile> {
  protected readonly context: ExecutorContext

  protected config: Config = null

  protected sourceFile: string = null

  constructor(context: ExecutorContext, config: Config) {
    this.context = context
    this.config = config

    this.sourceFile = injectProjectRoot(
      join(this.config.outputDirectory, `${this.config.defaultLanguage}.json`),
      this.config.projectRoot,
      this.context.root
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

      this.writeToFile(
        this.config.outputLanguages,
        languages.map((code) => ({
          code,
          language: languageNames.of(code)
        }))
      )
    }

    // Source terms
    const sourceTerms = this.getSourceTerms()

    while (languages.length > 0) {
      const code = languages.shift()

      if (
        this.config.skipDefaultLanguage &&
        code === this.config.defaultLanguage
      ) {
        continue
      }

      logger.info(`Pulling "${code}"`)

      const terms = await this.getTranslations(code)

      const translations = {}
      Object.keys(terms).forEach((term) => {
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

  public async push(language: string): Promise<void> {
    await this.assureRequirementsExists()

    if (!existsSync(this.sourceFile)) {
      throw new Error('Source file does not exist!')
    }

    const languageToPush = language || this.config.defaultLanguage
    const termsToPush =
      languageToPush === this.config.defaultLanguage
        ? this.getSourceTerms()
        : this.getLanguageTerms(languageToPush)

    if (languageToPush === this.config.defaultLanguage) {
      logger.info(
        `Going to upload ${Object.keys(termsToPush).length} source terms!`
      )
    } else {
      logger.info(
        `Going to upload ${
          Object.keys(termsToPush).length
        } terms to "${languageToPush}"!`
      )
    }

    await this.uploadTranslations(languageToPush, termsToPush)
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
    if (!existsSync(this.sourceFile)) {
      logger.warn(`Source file not found at "${this.sourceFile}"!`)

      return {}
    }

    return readJsonFile(this.sourceFile)
  }

  public getLanguageTerms(language: string) {
    const fileLocation = injectProjectRoot(
      `${this.config.outputDirectory}/${language}.json`,
      this.config.projectRoot,
      this.context.root
    )

    if (!existsSync(fileLocation)) {
      return {}
    }

    return readJsonFile(fileLocation)
  }

  protected writeToFile(to, data) {
    writeJsonFile(
      injectProjectRoot(to, this.config.projectRoot, this.context.root),
      data
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
