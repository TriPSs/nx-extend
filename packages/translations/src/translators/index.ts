import { BuilderContext } from '@angular-devkit/architect'
import DeeplTranslator from './deepl.translator'

export const getTranslator = (translator: string, context: BuilderContext): DeeplTranslator => {
  let providerClass
  if (translator === 'free-deepl') {
    context.logger.info(`Using "${translator}" translator`)

    providerClass = new DeeplTranslator('https://api-free.deepl.com')
  } else if (translator === 'deepl') {
    context.logger.info(`Using "${translator}" translator`)

    providerClass = new DeeplTranslator('https://api.deepl.com')
  }

  if (providerClass) {
    return providerClass
  }

  context.logger.warn(`"${translator}" is not an valid translator!`)

  return null
}
