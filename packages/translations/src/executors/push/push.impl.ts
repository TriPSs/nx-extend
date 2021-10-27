import { ExecutorContext, logger } from '@nrwl/devkit'

import { getProvider } from '../../providers'
import { getConfigFile } from '../../utils/config-file'

export interface PushSchema {
  provider?: string
  language?: string
}

export async function pushExtractor(
  options: PushSchema,
  context: ExecutorContext
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
    logger.info('Pushing translation source file')
    await provider.push(options.language)

    return {
      success: true
    }
  } catch (err) {
    logger.error('Error pushing source file')
    logger.error(err.message || err)
  }

  return {
    success: false
  }
}

export default pushExtractor
