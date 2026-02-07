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
import { VERCEL_COMMAND, VERCEL_TOKEN } from '../../utils/constants'
import { enrichVercelEnvFile } from '../../utils/enrich-vercel-env-file'
import { getEnvVars } from '../../utils/get-env-vars'
import { getOutputDirectory } from './utils/get-output-directory'

export interface BuildOptions {
  projectId: string
  orgId: string
  envVars?: Record<string, string>
  buildTarget?: string
  framework?: string
  outputPath?: string
  nodeVersion?: '20.x' | '22.x' | '24.x'
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

  const { root: projectRoot } = context.projectsConfigurations.projects[context.projectName]

  // Create repo.json, used for deployments to Vercel
  writeJsonFile(`./${vercelDirectory}/repo.json`, {
    orgId: options.orgId,
    remoteName: 'origin',
    projects: [
      {
        id: options.projectId,
        name: context.projectName,
        directory: projectRoot
      }
    ]
  })

  // First, make sure the .vercel/project.json exists
  const vercelProjectJson = `${projectRoot}/${vercelDirectory}/project.json`
  writeJsonFile(vercelProjectJson, {
    projectId: options.projectId,
    orgId: options.orgId,
    settings: {}
  })

  const vercelEnvironment = (context.configurationName === 'production' || options.deployment === 'production')
    ? 'production'
    : 'preview'

  const vercelEnvFile = `.env.${vercelEnvironment}.local`
  const vercelEnvFileLocation = join(projectRoot, vercelDirectory)

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
      nodeVersion: options.nodeVersion || '24.x'
    }
  })

  const projectVercelDirectory = `${projectRoot}/${vercelDirectory}`
  const { success } = execCommand(buildCommand([
    `${VERCEL_COMMAND} build`,
    `--output ${projectVercelDirectory}/output`,
    vercelEnvironment === 'production' && '--prod',
    options.config && `--local-config=${join(workspaceRoot, options.config)}`,
    VERCEL_TOKEN && `--token=${VERCEL_TOKEN}`,

    USE_VERBOSE_LOGGING && '--debug'
  ]), {
    cwd: projectRoot
  })

  if (success) {
    // Write the project.json to the .vercel directory
    writeJsonFile(
      join(projectVercelDirectory, 'project.json'),
      readJsonFile(vercelProjectJson)
    )
    // Also copy over the env files
    copyFile(
      vercelEnvFileLocation,
      projectVercelDirectory,
      vercelEnvFile
    )
    // Also copy the .vercelignore
    copyFile(
      context.root,
      projectVercelDirectory,
      '.vercelignore'
    )
  }

  return Promise.resolve({ success })
}

export default buildExecutor
