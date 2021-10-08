import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import { join } from 'path'
import { buildCommand, execCommand } from '@nx-extend/core'
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph'

import { ExtractSchema } from './schema'
import { injectProjectRoot } from '../../utils'
import { getConfigFile } from '../../utils/config-file'

export async function runBuilder(
  options: ExtractSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMetadata = await context.getProjectMetadata(context.target.project)

  const {
    outputDirectory = options.output,
    defaultLanguage = options.defaultLanguage,
    extractor = options.extractor,
  } = await getConfigFile(context)

  // Check if we need to extract from connected libs
  if (options.withLibs) {
    const projGraph = createProjectGraph()

    // Get all libs that are connected to this app
    const libRoots = await getLibsRoot(context, projGraph.dependencies, context.target.project, options.libPrefix)

    if (libRoots.length > 0) {
      options.sourceRoot = `{${options.sourceRoot},${libRoots.join(',')}}`
    }
  }

  const templatedSourceDirectory = injectProjectRoot(options.sourceRoot, projectMetadata.root, context.workspaceRoot)
  const templatedOutputDirectory = injectProjectRoot(outputDirectory, projectMetadata.root, context.workspaceRoot)

  try {
    if (extractor === 'formatjs') {
      execCommand(buildCommand([
        'npx formatjs extract',
        `'${join(templatedSourceDirectory, options.pattern)}'`,
        `--out-file='${templatedOutputDirectory}/${defaultLanguage}.json'`,
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
    context.logger.error(err)
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

export const getLibsRoot = async (context: BuilderContext, dependencies, project: string, prefix?: string, targetsDone = [], roots = []): Promise<string[]> => {
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

    await getLibsRoot(context, dependencies, connectedLib.target, prefix, targetsDone, roots)
  }))

  return roots
}

export default createBuilder(runBuilder)
