import { ExecutorContext, logger } from '@nx/devkit'

import { getProvider } from '../../providers'
import { getConfigFile } from '../../utils/config-file'

export interface PullSchema {
  provider?: string
}

export async function pullExtractor(
  options: PullSchema,
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
    logger.info('Pulling translations')
    await provider.pull()

    return {
      success: true
    }
  } catch (err) {
    logger.error('Error pulling translations')
    logger.error(err.message || err)
  }

  return {
    success: false
  }
}

export default pullExtractor
