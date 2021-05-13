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
    context.logger.info('Pushing translation source file')
    await provider.push()

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
