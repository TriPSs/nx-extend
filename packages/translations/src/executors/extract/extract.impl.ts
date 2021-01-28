import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import extractIntlMessages from 'extract-react-intl-messages'
import { join } from 'path'

import { ExtractSchema } from './schema'
import { BaseProvider, getProvider } from '../../providers'

export async function runBuilder(
  options: ExtractSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMetadata = await context.getProjectMetadata(context.target.project)
  const projectRoot = join(`${context.workspaceRoot}`, `${projectMetadata.root}`)

  let provider: BaseProvider = null
  let settings = {
    languages: options.languages,
    defaultLocale: options.defaultLanguage
  }

  // If provider is given then try to use it
  if (options.provider) {
    provider = await getProvider(options.provider, context)
  }

  if (provider) {
    settings = provider.getExtractSettings(projectRoot)
  }

  try {
    await extractIntlMessages(
      settings.languages,
      join(`${context.workspaceRoot}`, options.sourceRoot.replace('<sourceRoot>', `${projectMetadata.sourceRoot}`), options.pattern),
      join(`${context.workspaceRoot}`, `${projectMetadata.sourceRoot}`, options.output),
      {
        defaultLocale: settings.defaultLocale,
        flat: true,
        format: 'json'
      }
    )

    context.logger.info('Translations extracted')

    return {
      success: true
    }
  } catch (err) {
    context.logger.error('Error extracting translations')
    console.error(err)
  }

  return {
    success: false
  }
}

export default createBuilder(runBuilder)
