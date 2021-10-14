import { BuilderContext, createBuilder } from '@angular-devkit/architect'

import { PushSchema } from './schema'
import { getProvider } from '../../providers'
import { getConfigFile } from '../../utils/config-file'

export async function runBuilder(
  options: PushSchema,
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
    context.logger.info('Pushing translation source file')
    await provider.push(options.language)

    return {
      success: true
    }
  } catch (err) {
    context.logger.error('Error pushing source file')
    context.logger.error(err.message || err)
  }

  return {
    success: false
  }
}

export default createBuilder(runBuilder)
