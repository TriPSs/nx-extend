import { ExecutorContext, logger } from '@nx/devkit'

import { getProvider } from '../../providers'
import { getConfigFile } from '../../utils/config-file'

export interface TranslateSchema {
  provider?: string
}

export async function translateExtractor(
  options: TranslateSchema,
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
    logger.info('Start translating files')

    await provider.translate()

    return {
      success: true
    }
  } catch (err) {
     logger.error('Error translating files')
    logger.error(err.message || err)
  }

  return {
    success: false
  }
}

export default translateExtractor
