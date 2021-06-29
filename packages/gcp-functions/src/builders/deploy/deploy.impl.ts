import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { buildCommand, execCommand } from '@nx-extend/core'
import { resolve } from 'path'

import { DeployExecutorSchema } from './schema'

export async function runBuilder(options: DeployExecutorSchema, context: BuilderContext): Promise<{ success: boolean }> {
  const {
    functionName,
    region,
    trigger = 'http',
    triggerValue = null,
    runtime = 'nodejs14',
    allowUnauthenticated = true,
    envVarsFile = null,
    maxInstances = 10,
    project = null,
    memory = '128MB',
    serviceAccount = null,
    entryPoint = null,
    retry = false,
    ingressSettings = null,
    egressSettings = null
  } = options

  const buildOptions = await context.getTargetOptions({
    project: context.target && context.target.project,
    target: 'build'
  })

  const sourceDirectory = resolve(
    process.cwd(),
    buildOptions.outputPath.toString()
  )

  context.logger.info(
    `Deploy function "${functionName}" with source from "${sourceDirectory}"`
  )

  return execCommand(buildCommand([
    'gcloud functions deploy',
    functionName,
    `--trigger-${trigger}${triggerValue ? `=${triggerValue}` : ''}`,
    `--runtime=${runtime}`,
    `--memory=${memory}`,
    `--region=${region}`,

    entryPoint ? `--entry-point=${entryPoint}` : false,
    envVarsFile ? `--env-vars-file=${envVarsFile}` : false,
    retry ? `--retry` : false,
    ingressSettings ? `--ingress-settings=${ingressSettings}` : false,
    egressSettings ? `--egress-settings=${egressSettings}` : false,

    `--source=${sourceDirectory}`,
    `--max-instances=${maxInstances}`,

    allowUnauthenticated ? '--allow-unauthenticated' : false,
    serviceAccount ? `--service-account=${serviceAccount}` : false,

    project ? `--project=${project}` : false
  ]))
}

export default createBuilder(runBuilder)
