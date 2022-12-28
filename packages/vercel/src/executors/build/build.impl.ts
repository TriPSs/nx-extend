import { readJsonFile, writeJsonFile } from '@nrwl/devkit'
import { buildCommand, copyFile, execCommand } from '@nx-extend/core'
import { existsSync, rmSync } from 'fs'
import { join } from 'path'

import type { ExecutorContext } from '@nrwl/devkit'

import { addEnvVariablesToFile } from '../../utils/add-env-variables-to-file'
import { enrichVercelEnvFile } from '../../utils/enrich-vercel-env-file'
import { getEnvVars } from '../../utils/get-env-vars'
import { vercelToken } from '../../utils/vercel-token'
import { getOutputDirectory } from './utils/get-output-directory'

export interface BuildOptions {
  projectId: string
  orgId: string
  debug?: boolean
  envVars?: Record<string, string>
  buildTarget?: string
  buildConfig?: string
  framework?: string
  nodeVersion?: '16.x'
}

export function buildExecutor(
  options: BuildOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { targets } = context.workspace.projects[context.projectName]
  const framework = options.framework || 'nextjs'
  const buildTarget = options.buildTarget || (framework === 'nextjs' ? 'build-next' : 'build')

  if (!options.orgId) {
    throw new Error(`"orgId" option is required!`)
  }

  if (!options.projectId) {
    throw new Error(`"projectId" option is required!`)
  }

  if (!targets[buildTarget]) {
    throw new Error(`"${context.projectName}" is missing the "${buildTarget}" target!`)
  }

  if (!targets[buildTarget]?.options?.outputPath) {
    throw new Error(`"${buildTarget}" target has no "outputPath" configured!`)
  }

  if (options.buildConfig && !targets[buildTarget]?.configurations[options.buildConfig]) {
    throw new Error(`"${buildTarget}" target has no configuration "${options.buildConfig}"!`)
  }

  const vercelDirectory = '.vercel'
  const vercelDirectoryLocation = join(context.root, vercelDirectory)

  if (existsSync(vercelDirectoryLocation)) {
    rmSync(vercelDirectoryLocation)
  }

  // First make sure the .vercel/project.json exists
  writeJsonFile(`./${vercelDirectory}/project.json`, {
    projectId: options.projectId,
    orgId: options.orgId,
    settings: {}
  })

  const vercelEnironment = context.configurationName === 'production'
    ? 'production'
    : 'preview'

  // Pull latest
  execCommand(buildCommand([
    'npx vercel pull --yes',
    `--environment=${vercelEnironment}`,
    vercelToken && `--token=${vercelToken}`,

    options.debug && '--debug'
  ]))

  const vercelDirectory = '.vercel'
  const vercelProjectJson = `./${vercelDirectory}/project.json`
  const outputDirectory = targets[buildTarget]?.options?.outputPath

  const vercelEnvFile = `.env.${vercelEnironment}.local`
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
      installCommand: 'echo \'\'',
      buildCommand: `nx run ${context.projectName}:${buildTarget}:${options.buildConfig || context.configurationName}`,
      outputDirectory: getOutputDirectory(framework, outputDirectory),
      rootDirectory: null,
      directoryListing: false,
      nodeVersion: options.nodeVersion || '16.x'
    }
  })

  const { success } = execCommand(buildCommand([
    'npx vercel build',
    `--output ${targets[buildTarget].options.outputPath}/.vercel/output`,
    context.configurationName === 'production' && '--prod',
    vercelToken && `--token=${vercelToken}`,

    options.debug && '--debug'
  ]))

  if (success) {
    // Write the project.json to the .vercel directory
    writeJsonFile(join(outputDirectory, vercelDirectory, 'project.json'), readJsonFile(vercelProjectJson))
    // Also copy over the env files
    copyFile(vercelEnvFileLocation, join(outputDirectory, vercelDirectory), vercelEnvFile)
    // Also copy the .vercelignore
    copyFile(context.root, join(outputDirectory, vercelDirectory), '.vercelignore')
  }

  return Promise.resolve({ success })
}

export default buildExecutor
