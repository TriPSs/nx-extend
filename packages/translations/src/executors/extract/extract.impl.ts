import { ExecutorContext, logger } from '@nx/devkit'
import { createProjectGraphAsync } from '@nx/workspace/src/core/project-graph'
import { buildCommand, execCommand } from '@nx-extend/core'
import { join } from 'path'

import { injectProjectRoot } from '../../utils'
import { getConfigFile } from '../../utils/config-file'

export interface ExtractSchema {
  provider?: string
  sourceRoot?: string
  pattern?: string
  defaultLanguage?: string
  output?: string
  extractor?: 'formatjs'
  libPrefix?: string
  withLibs?: boolean
  libsBlacklist?: string | string[]

  debug?: boolean
}

export async function extractExectutor(
  options: ExtractSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.workspace.projects[context.projectName]

  const {
    outputDirectory = options.output,
    defaultLanguage = options.defaultLanguage,
    extractor = options.extractor
  } = await getConfigFile(context)

  // Check if we need to extract from connected libs
  if (options.withLibs) {
    const blacklist = Array.isArray(options.libsBlacklist)
      ? options.libsBlacklist
      : (options.libsBlacklist || '').split(',')

    // Get all libs that are connected to this app
    const libRoots = await getLibsRoot(
      context,
      context.projectName,
      blacklist,
      options.libPrefix,
      [],
      [],
      options.debug
    )

    if (libRoots.length > 0) {
      options.sourceRoot = `{${options.sourceRoot},${libRoots.join(',')}}`
    }
  }

  const templatedSourceDirectory = injectProjectRoot(
    options.sourceRoot,
    root,
    context.root
  )
  const templatedOutputDirectory = injectProjectRoot(
    outputDirectory,
    root,
    context.root
  )

  try {
    if (extractor === 'formatjs') {
      execCommand(
        buildCommand([
          'npx formatjs extract',
          `'${join(templatedSourceDirectory, options.pattern)}'`,
          `--out-file='${templatedOutputDirectory}/${defaultLanguage}.json'`,
          "--id-interpolation-pattern='[sha512:contenthash:base64:6]'",
          '--format=simple'
        ]),
        {
          silent: !options.debug
        }
      )
    } else {
      logger.error('Unsupported extractor!')

      return {
        success: false
      }
    }

    logger.info('Translations extracted')

    return {
      success: true
    }
  } catch (err) {
    logger.error('Error extracting translations')
    logger.error(err)
  }

  return {
    success: false
  }
}

export const getConnectedLibs = (
  dependencies,
  project: string,
  blacklist: string[],
  prefix?: string
) =>
  dependencies[project].filter(
    (dep) =>
      !dep.target.startsWith('npm:') &&
      (!prefix || dep.target.startsWith(prefix)) &&
      !blacklist.includes(dep.target)
  )

export const getLibsRoot = async (
  context: ExecutorContext,
  project: string,
  blacklist: string[],
  prefix?: string,
  targetsDone = [],
  roots = [],
  debugMode = false
): Promise<string[]> => {
  const projectGraph = await createProjectGraphAsync()
  const libs = getConnectedLibs(
    projectGraph.dependencies,
    project,
    blacklist,
    prefix
  )

  await Promise.all(
    libs.map(async (connectedLib) => {
      if (targetsDone.includes(connectedLib.target)) {
        // If the target is already done then skip it
        return
      }

      const libMetadata = context.workspace.projects[connectedLib.target]
      targetsDone.push(connectedLib.target)

      if (!roots.includes(libMetadata.sourceRoot)) {
        if (debugMode) {
          logger.debug(
            `Adding source root "${connectedLib.target}" because it's a dependency of "${project}"`
          )
        }
        roots.push(libMetadata.sourceRoot)
      }

      await getLibsRoot(
        context,
        connectedLib.target,
        blacklist,
        prefix,
        targetsDone,
        roots,
        debugMode
      )
    })
  )

  return roots
}

export default extractExectutor
