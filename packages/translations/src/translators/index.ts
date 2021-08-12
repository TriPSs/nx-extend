import { BuilderContext } from '@angular-devkit/architect'

import DeeplTranslator from './deepl.translator'

export const getTranslator = (translator: string, context: BuilderContext, options = {}): DeeplTranslator => {
  let providerClass

  if (translator === 'free-deepl') {
    context.logger.info(`Using "${translator}" translator`)

    providerClass = new DeeplTranslator('https://api-free.deepl.com', options)

  } else if (translator === 'deepl') {
    context.logger.info(`Using "${translator}" translator`)

    providerClass = new DeeplTranslator('https://api.deepl.com', options)

  } else if (translator === 'itranslate') {
    // TODO:: https://www.itranslate.com/itranslate-translation-api-contact-form
  }

  if (providerClass) {
    return providerClass
  }

  context.logger.warn(`"${translator}" is not an valid translator!`)

  return null
}
