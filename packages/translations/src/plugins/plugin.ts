import {
  CreateDependencies,
  CreateNodes,
  CreateNodesContext,
  detectPackageManager,
  readJsonFile,
  TargetConfiguration,
  writeJsonFile
} from '@nx/devkit'
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes'
import { getNamedInputs } from '@nx/devkit/src/utils/get-named-inputs'
import { existsSync, readdirSync } from 'fs'
import { getLockFileName } from 'nx/src/plugins/js/lock-file/lock-file'
import { workspaceDataDirectory } from 'nx/src/utils/cache-directory'
import { dirname, join } from 'path'

import { BaseConfigFile, getConfigFileInRoot } from '../utils/config-file'

export interface TranslationPluginOptions {
  extractTargetName?: string
  pullTargetName?: string
  pushTargetName?: string
  translateTargetName?: string
}

const cachePath = join(workspaceDataDirectory, 'nx-extend.translations.hash')
const targetsCache = existsSync(cachePath) ? readTargetsCache() : {}

const calculatedTargets: Record<
  string,
  Record<string, TargetConfiguration>
> = {}

function readTargetsCache(): Record<
  string,
  Record<string, TargetConfiguration>
> {
  return readJsonFile(cachePath)
}

function writeTargetsToCache(
  targets: Record<string, Record<string, TargetConfiguration>>
) {
  writeJsonFile(cachePath, targets)
}

export const createDependencies: CreateDependencies = () => {
  writeTargetsToCache(calculatedTargets)

  return []
}

export const createNodes: CreateNodes<TranslationPluginOptions> = [
  '**/.translationsrc.json',
  async (configFilePath, options, context) => {
    const projectRoot = dirname(configFilePath)
    const fullyQualifiedProjectRoot = join(context.workspaceRoot, projectRoot)

    // Do not create a project if package.json and project.json isn't there
    const siblingFiles = readdirSync(fullyQualifiedProjectRoot)
    if (!siblingFiles.includes('project.json') || siblingFiles.includes('nx.json')) {
      return {}
    }

    const config = getConfigFileInRoot(projectRoot)
    options = normalizeOptions(options)

    const hash = await calculateHashForCreateNodes(projectRoot, options, context, [
      getLockFileName(detectPackageManager(context.workspaceRoot))
    ])

    const targets = targetsCache[hash] ?? buildTranslationTargets(
      projectRoot,
      context,
      config,
      options
    )

    calculatedTargets[hash] = targets

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: targets
        }
      }
    }
  }
]

function buildTranslationTargets(
  projectRoot: string,
  context: CreateNodesContext,
  config: BaseConfigFile,
  options: TranslationPluginOptions
): Record<string, TargetConfiguration> {
  const targets: Record<string, TargetConfiguration> = {}

  if (!config.disableExtract) {
    targets[options.extractTargetName] = buildExtract(projectRoot, context)
  }

  if (!config.disablePull) {
    targets[options.pullTargetName] = buildExecutor('pull')
  }

  if (!config.disablePush) {
    targets[options.pushTargetName] = buildExecutor('push')
  }

  if (!config.disableTranslate) {
    targets[options.translateTargetName] = buildExecutor('translate')
  }

  return targets
}

function buildExtract(
  projectRoot: string,
  context: CreateNodesContext
): TargetConfiguration {
  const namedInputs = getNamedInputs(projectRoot, context)

  return {
    cache: true,
    inputs: [
      ...('production' in namedInputs
        ? ['production', '^production']
        : ['default', '^default'])
    ],
    ...buildExecutor('extract')
  }
}

function buildExecutor(type: string): TargetConfiguration {
  return {
    executor: `@nx-extend/translations:${type}`,
    options: {}
  }
}

function normalizeOptions(options: TranslationPluginOptions) {
  options ??= {}
  options.extractTargetName ??= 'extract-translations'
  options.pullTargetName ??= 'pull-translations'
  options.pushTargetName ??= 'push-translations'
  options.translateTargetName ??= 'translate'

  return options
}
