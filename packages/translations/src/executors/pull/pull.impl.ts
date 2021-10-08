import { BuilderContext, createBuilder } from '@angular-devkit/architect'

import { PullSchema } from './schema'
import { getProvider } from '../../providers'
import { getConfigFile } from '../../utils/config-file'

export async function runBuilder(
  options: PullSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const configFile = await getConfigFile(context)

  if (!configFile.provider && !options.provider) {
    throw Error('Provider is required when pulling translations!')
  }

  const provider = await getProvider(
    configFile.provider || options.provider,
    context,
    configFile
  )

  try {
    context.logger.info('Pulling translations')
    await provider.pull()

    return {
      success: true
    }
  } catch (err) {
    context.logger.error('Error pulling translations')
    context.logger.error(err.message || err)
  }

  return {
    success: false
  }
}

export default createBuilder(runBuilder)
