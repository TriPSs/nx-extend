import { BuilderContext, createBuilder } from '@angular-devkit/architect'

import { PushSchema } from './schema'
import { getProvider } from '../../providers'

export async function runBuilder(
  options: PushSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const provider = await getProvider(options.provider, context)

  if (!provider) {
    throw Error('Provider is required when pushing translations!')
  }

  try {
    context.logger.info('Start translating files')

    // TODO:: Refactor this that it can also translate without provider
    // provider.getToTranslatedTerms(options.locale)

    // await translator.translate(messages.slice(0, options.batchSize), defaultLocale, options.locale)
    await provider.translate()

    // provider.storeTranslatedTerms(options.locale, translatedTerms)

    return {
      success: true
    }
  } catch (err) {
    context.logger.error('Error pushing source file')

    console.error(err.message || err)
  }

  return {
    success: false
  }
}

export default createBuilder(runBuilder)
