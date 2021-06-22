import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import extractIntlMessages from 'extract-react-intl-messages'
import { join } from 'path'
import { buildCommand, execCommand } from '@nx-extend/core'
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph'

import { ExtractSchema } from './schema'
import { BaseProvider, getProvider } from '../../providers'
import { injectProjectRoot } from '../../utils'

export async function runBuilder(
  options: ExtractSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMetadata = await context.getProjectMetadata(context.target.project)

  let provider: BaseProvider<any> = null
  let settings

  // If provider is given then try to use it
  if (options.provider) {
    provider = await getProvider(options.provider, context)

    settings = provider.getExtractSettings()
  }

  // If no output directory is defined the use the one from options
  if (!settings.outputDirectory) {
    settings.outputDirectory = options.output
  }

  // If no output directory is defined the use the one from options
  if (!settings.defaultLanguage) {
    settings.defaultLanguage = options.defaultLanguage
  }

  // If no output directory is defined the use the one from options
  if (!settings.extractor) {
    settings.extractor = options.extractor
  }

  // Check if we need to extract from connected libs
  if (options.withLibs) {
    const projGraph = createProjectGraph()

    // Get all libs that are connected to this app
    const libRoots = await getLibsRoot(context, projGraph.dependencies, context.target.project, options.libPrefix)

    if (libRoots.length > 0) {
      options.sourceRoot = `{${options.sourceRoot},${libRoots.join(',')}}`
    }
  }

  const sourceDirectory = injectProjectRoot(options.sourceRoot, projectMetadata.root, context.workspaceRoot)
  const outputDirectory = injectProjectRoot(settings.outputDirectory, projectMetadata.root, context.workspaceRoot)

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

export const getConnectedLibs = (dependencies, project: string, prefix?: string) => (
  dependencies[project].filter((dep) => (
    !dep.target.startsWith('npm:')
    && (!prefix || dep.target.startsWith(prefix))
  ))
)

export const getLibsRoot = async (context: BuilderContext, dependencies, project: string, prefix?: string, targetsDone = []): Promise<string[]> => {
  let roots = []

  const libs = getConnectedLibs(dependencies, project, prefix)

  await Promise.all(libs.map(async (connectedLib) => {
    if (targetsDone.includes(connectedLib.target)) {
      // If the target is already done then skip it
      return
    }

    const projectMetadata = await context.getProjectMetadata(connectedLib.target)
    targetsDone.push(connectedLib.target)

    if (!roots.includes(projectMetadata.root)) {
      roots.push(projectMetadata.root)
    }

    roots = roots.concat(roots, await getLibsRoot(context, dependencies, connectedLib.target, prefix, targetsDone))
  }))

  return roots
}

export default createBuilder(runBuilder)
