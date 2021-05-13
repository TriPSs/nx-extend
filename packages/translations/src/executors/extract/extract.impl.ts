import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import extractIntlMessages from 'extract-react-intl-messages'
import { join } from 'path'

import { ExtractSchema } from './schema'
import { ExtractSettings } from '../../providers/base.provider'
import { BaseProvider, getProvider } from '../../providers'
import { injectProjectRoot } from '../../utils'
import { buildCommand, execCommand } from '@nx-extend/core'

export async function runBuilder(
  options: ExtractSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMetadata = await context.getProjectMetadata(context.target.project)
  const projectRoot = join(`${context.workspaceRoot}`, `${projectMetadata.root}`)

  let provider: BaseProvider<any> = null
  let settings: ExtractSettings = {
    defaultLocale: options.defaultLanguage,
    outputDirectory: undefined,
    extractor: options.extractor
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

  const sourceDirectory = injectProjectRoot(options.sourceRoot, projectRoot, context.workspaceRoot)
  const outputDirectory = injectProjectRoot(settings.outputDirectory, projectRoot, context.workspaceRoot)

  try {
    if (settings.extractor === 'react-intl') {
      await extractIntlMessages(
        [settings.defaultLocale],
        join(sourceDirectory, options.pattern),
        outputDirectory,
        {
          defaultLocale: settings.defaultLocale,
          flat: true,
          format: 'json'
        }
      )
    } else if (settings.extractor === 'formatjs') {
      await execCommand(buildCommand([
        'npx formatjs extract',
        `'${join(sourceDirectory, options.pattern)}'`,
        `--out-file='${outputDirectory}/${settings.defaultLocale}.json'`,
        '--id-interpolation-pattern=\'[sha512:contenthash:base64:6]\'',
        '--format=simple'
      ]))

    } else {
      context.logger.error('Unsupported extractor!')

      return {
        success: false
      }
    }

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
