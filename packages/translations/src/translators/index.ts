import { ExecutorContext, logger } from '@nx/devkit'

import { BaseConfigFile } from '../utils/config-file'
import DeeplTranslator from './deepl.translator'

export const getTranslator = (
  context: ExecutorContext,
  config: BaseConfigFile
): DeeplTranslator => {
  switch (config.translator) {
    case 'free-deepl':
      return new DeeplTranslator(context, config, 'https://api-free.deepl.com')

    case 'deepl':
      return new DeeplTranslator(context, config, 'https://api.deepl.com')

    // case 'itranslate':
    // TODO:: https://www.itranslate.com/itranslate-translation-api-contact-form

    default:
      logger.warn(`"${config.translator}" is not an valid translator!`)
      return null
  }
}
