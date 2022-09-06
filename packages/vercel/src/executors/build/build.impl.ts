import { readJsonFile, writeJsonFile } from '@nrwl/devkit'
import { buildCommand, copyFile, execCommand, getEnvVars } from '@nx-extend/core'
import { join } from 'path'

import type { ExecutorContext } from '@nrwl/devkit'

import { addEnvVariablesToFile } from '../../utils/add-env-variables-to-file'

export interface ExecutorSchema {
  projectId: string
  orgId: string
  debug?: boolean
  envVars?: Record<string, string>
}

export function buildExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { targets } = context.workspace.projects[context.projectName]

  if (!options.orgId) {
    throw new Error(`"orgId" option is required!`)
  }

  if (!options.projectId) {
    throw new Error(`"projectId" option is required!`)
  }

  if (!targets['build-next']) {
    throw new Error(`"${context.projectName}" is missing the original "build-next" target!`)
  }

  if (!targets['build-next']?.options?.outputPath) {
    throw new Error('"build-next" target has no "outputPath" configured!')
  }

  // First make sure the .vercel/project.json exists
  writeJsonFile('./.vercel/project.json', {
    projectId: options.projectId,
    orgId: options.orgId,
    settings: {}
  })

  // Pull latest
  execCommand(buildCommand([
    'npx vercel pull --yes',
    context.configurationName === 'production' && '--environment=production',
    context.configurationName !== 'production' && '--environment=preview',

    options.debug && '--debug'
  ]))

  const vercelDirectory = '.vercel'
  const vercelProjectJson = `./${vercelDirectory}/project.json`
  const outputDirectory = targets['build-next']?.options?.outputPath

  const vercelEnironment = context.configurationName === 'production'
    ? 'production'
    : 'preview'

  const vercelEnvFile = `.env.${vercelEnironment}.local`
  const vercelEnvFileLocation = join(context.root, vercelDirectory)

  const envVars = getEnvVars(options.envVars, true)
  if (envVars.length > 0) {
    addEnvVariablesToFile(join(vercelEnvFileLocation, vercelEnvFile), envVars)
  }

  // Update the project json with the correct settings
  writeJsonFile(vercelProjectJson, {
    projectId: options.projectId,
    orgId: options.orgId,
    settings: {
      createdAt: new Date().getTime(),
      framework: 'nextjs',
      devCommand: null,
      installCommand: 'echo \'\'',
      buildCommand: `nx build-next ${context.projectName}${context.configurationName === 'production' ? ' --prod' : ''}`,
      outputDirectory: `${targets['build-next']?.options?.outputPath}/.next`,
      rootDirectory: null,
      directoryListing: false,
      nodeVersion: '16.x'
    }
  })

  const { success } = execCommand(buildCommand([
    'npx vercel build',
    `--output ${targets['build-next']?.options?.outputPath}/.vercel/output`,

    options.debug && '--debug'
  ]))

  if (success) {
    // Write the project.json to the .vercel directory
    writeJsonFile(join(outputDirectory, vercelDirectory, 'project.json'), readJsonFile(vercelProjectJson))
    // Also copy over the env files
    copyFile(vercelEnvFileLocation, join(outputDirectory, vercelDirectory), vercelEnvFile)
  }

  return Promise.resolve({ success })
}

export default buildExecutor
