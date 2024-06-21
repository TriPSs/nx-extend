import { createNodesFromFiles } from '@nx/devkit'
import { getNamedInputs } from '@nx/devkit/src/utils/get-named-inputs'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'

import type { CreateNodesResultV2, CreateNodesV2, TargetConfiguration } from '@nx/devkit'
import type { CreateNodesContext, CreateNodesResult } from '@nx/devkit'

import { BaseConfigFile, getConfigFileInRoot } from '../utils/config-file'

export interface TranslationPluginOptions {
  extractTargetName?: string
  pullTargetName?: string
  pushTargetName?: string
  translateTargetName?: string
}

export const createNodesV2: CreateNodesV2 = [
  '**/.translationsrc.json',
  async (configFiles, options: TranslationPluginOptions, context): Promise<CreateNodesResultV2> => {
    console.log('context.workspaceRoot',context.workspaceRoot)
    return createNodesFromFiles(
      createTargets,
      configFiles,
      options,
      context
    )
  }
]

function createTargets(projectConfigurationFile: string, options: TranslationPluginOptions, context: CreateNodesContext): CreateNodesResult {
  const projectRoot = dirname(projectConfigurationFile)
  const fullyQualifiedProjectRoot = join(context.workspaceRoot, projectRoot)

  // Do not create a project if package.json and project.json isn't there
  const siblingFiles = readdirSync(fullyQualifiedProjectRoot)
  if (!siblingFiles.includes('project.json') || siblingFiles.includes('nx.json')) {
    return {}
  }

  const config = getConfigFileInRoot(projectRoot)
  options = normalizeOptions(options)

  return {
    projects: {
      [projectRoot]: {
        root: projectRoot,
        targets: buildTranslationTargets(
          projectRoot,
          context,
          config,
          options
        )
      }
    }
  }
}

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
