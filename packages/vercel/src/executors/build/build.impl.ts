import { parseTargetString, readCachedProjectGraph, readJsonFile, workspaceRoot, writeJsonFile } from '@nx/devkit'
import { targetToTargetString } from '@nx/devkit/src/executors/parse-target-string'
import {
  buildCommand,
  copyFile,
  execCommand,
  getOutputDirectoryFromBuildTarget,
  USE_VERBOSE_LOGGING
} from '@nx-extend/core'
import { existsSync, rmSync } from 'fs'
import { join } from 'path'

import type { ExecutorContext } from '@nx/devkit'

import { addEnvVariablesToFile } from '../../utils/add-env-variables-to-file'
import { enrichVercelEnvFile } from '../../utils/enrich-vercel-env-file'
import { getEnvVars } from '../../utils/get-env-vars'
import { vercelToken } from '../../utils/vercel-token'
import { getOutputDirectory } from './utils/get-output-directory'

export interface BuildOptions {
  projectId: string
  orgId: string
  envVars?: Record<string, string>
  buildTarget?: string
  framework?: string
  outputPath?: string
  nodeVersion?: '20.x' | '22.x'
  config?: string
  deployment?: 'preview' | 'production'
}

export function buildExecutor(
  options: BuildOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const framework = options.framework || 'nextjs'
  let buildTarget = options.buildTarget || (framework === 'nextjs' ? 'build-next' : 'build')

  if (!buildTarget.includes(':')) {
    buildTarget = `${context.projectName}:${buildTarget}`
  }

  const targetString = parseTargetString(buildTarget, readCachedProjectGraph())

  if (!options.orgId) {
    throw new Error(`"orgId" option is required!`)
  }

  if (!options.projectId) {
    throw new Error(`"projectId" option is required!`)
  }

  if (!targetString) {
    throw new Error(`Invalid build target "${buildTarget}"!`)
  }

  const outputDirectory = options.outputPath || getOutputDirectoryFromBuildTarget(context, buildTarget)
  if (!outputDirectory) {
    throw new Error(`"${buildTarget}" target has no "outputPath" configured!`)
  }

  const vercelDirectory = '.vercel'
  const vercelDirectoryLocation = join(context.root, vercelDirectory)

  if (existsSync(vercelDirectoryLocation)) {
    rmSync(vercelDirectoryLocation, {
      recursive: true
    })
  }

  // First make sure the .vercel/project.json exists
  writeJsonFile(`./${vercelDirectory}/project.json`, {
    projectId: options.projectId,
    orgId: options.orgId,
    settings: {}
  })

  const vercelCommand = 'npx vercel@33.0.2'
  const vercelEnvironment = context.configurationName === 'production' ? 'production' : 'preview'

  // Pull latest
  const { success: pullSuccess } = execCommand(buildCommand([
    `${vercelCommand} pull --yes`,
    `--environment=${vercelEnvironment}`,
    vercelToken && `--token=${vercelToken}`,

    USE_VERBOSE_LOGGING && '--debug'
  ]))

  if (!pullSuccess) {
    throw new Error(`Was unable to pull!`)
  }

  const vercelProjectJson = `./${vercelDirectory}/project.json`
  const vercelEnvFile = `.env.${vercelEnvironment}.local`
  const vercelEnvFileLocation = join(context.root, vercelDirectory)

  const envVars = getEnvVars(options.envVars, true)
  if (envVars.length > 0) {
    addEnvVariablesToFile(join(vercelEnvFileLocation, vercelEnvFile), envVars)
  }

  enrichVercelEnvFile(join(vercelEnvFileLocation, vercelEnvFile))

  // Update the project json with the correct settings
  writeJsonFile(vercelProjectJson, {
    projectId: options.projectId,
    orgId: options.orgId,
    settings: {
      createdAt: new Date().getTime(),
      framework,
      devCommand: null,
      installCommand: 'echo ""',
      buildCommand: `nx run ${targetToTargetString(targetString)}`,
      outputDirectory: getOutputDirectory(framework, outputDirectory),
      rootDirectory: null,
      directoryListing: false,
      nodeVersion: options.nodeVersion || '22.x'
    }
  })

  const { success } = execCommand(buildCommand([
    `${vercelCommand} build`,
    `--output ${outputDirectory}/.vercel/output`,
    (context.configurationName === 'production' || options.deployment === 'production') && '--prod',
    options.config && `--local-config=${join(workspaceRoot, options.config)}`,
    vercelToken && `--token=${vercelToken}`,

    USE_VERBOSE_LOGGING && '--debug'
  ]))

  if (success) {
    // Write the project.json to the .vercel directory
    writeJsonFile(
      join(outputDirectory, vercelDirectory, 'project.json'),
      readJsonFile(vercelProjectJson)
    )
    // Also copy over the env files
    copyFile(
      vercelEnvFileLocation,
      join(outputDirectory, vercelDirectory),
      vercelEnvFile
    )
    // Also copy the .vercelignore
    copyFile(
      context.root,
      join(outputDirectory, vercelDirectory),
      '.vercelignore'
    )
  }

  return Promise.resolve({ success })
}

export default buildExecutor
