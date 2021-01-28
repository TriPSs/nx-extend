import { BuilderContext, createBuilder } from '@angular-devkit/architect'

import { PullSchema } from './schema'
import { getProvider } from '../../providers'

export async function runBuilder(
  options: PullSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const provider = await getProvider(options.provider, context)

  if (!provider) {
    throw Error('Provider is required when pulling translations!')
  }

  try {
    context.logger.info('Pulling translations')
    await provider.pull()

    return {
      success: true
    }
  } catch (err) {
    context.logger.error('Error pulling translations')

    console.error(err.message || err)
  }

  return {
    success: false
  }
}

export default createBuilder(runBuilder)
