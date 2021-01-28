import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import extractIntlMessages from 'extract-react-intl-messages'
import { join } from 'path'

import { ExtractSchema } from './schema'
import { ExtractSettings } from '../../providers/base.provider'
import { BaseProvider, getProvider } from '../../providers'
import { injectProjectRoot } from '../../utils'

export async function runBuilder(
  options: ExtractSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMetadata = await context.getProjectMetadata(context.target.project)
  const projectRoot = join(`${context.workspaceRoot}`, `${projectMetadata.root}`)

  let provider: BaseProvider = null
  let settings: ExtractSettings = {
    languages: options.languages,
    defaultLocale: options.defaultLanguage,
    outputDirectory: undefined
  }

  // If provider is given then try to use it
  if (options.provider) {
    provider = await getProvider(options.provider, context)
  }

  if (provider) {
    settings = provider.getExtractSettings()
  }

  // If no output directory is defined the use the one from options
  if (!settings.outputDirectory) {
    settings.outputDirectory = options.output
  }

  try {
    const sourceDirectory = injectProjectRoot(options.sourceRoot, projectRoot, context.workspaceRoot)
    const outputDirectory = injectProjectRoot(settings.outputDirectory, projectRoot, context.workspaceRoot)

    await extractIntlMessages(
      settings.languages,
      join(sourceDirectory, options.pattern),
      outputDirectory,
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
