import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import extractIntlMessages from 'extract-react-intl-messages'
import { join } from 'path'

import { ExtractSchema } from './schema'

export async function runBuilder(
  options: ExtractSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMetadata = await context.getProjectMetadata(context.target.project)

  try {
    await extractIntlMessages(
      options.languages,
      join(`${context.workspaceRoot}`, options.sourceRoot.replace('<sourceRoot>', `${projectMetadata.sourceRoot}`), options.pattern),
      join(`${context.workspaceRoot}`, `${projectMetadata.sourceRoot}`, options.output),
      {
        defaultLocale: options.defaultLanguage,
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
