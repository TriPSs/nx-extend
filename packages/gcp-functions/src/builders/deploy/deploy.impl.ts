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
    triggerEvent = null,
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
    egressSettings = null,
    securityLevel = null
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
    triggerEvent && `--trigger-event=${triggerEvent}`,
    `--runtime=${runtime}`,
    `--memory=${memory}`,
    `--region=${region}`,

    entryPoint && `--entry-point=${entryPoint}`,
    envVarsFile && `--env-vars-file=${envVarsFile}`,
    retry && `--retry`,
    ingressSettings && `--ingress-settings=${ingressSettings}`,
    egressSettings && `--egress-settings=${egressSettings}`,
    securityLevel && `--security-level=${securityLevel}`,

    `--source=${sourceDirectory}`,
    `--max-instances=${maxInstances}`,

    allowUnauthenticated && '--allow-unauthenticated',
    serviceAccount && `--service-account=${serviceAccount}`,

    project && `--project=${project}`
  ]))
}

export default createBuilder(runBuilder)
