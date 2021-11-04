import { ExecutorContext } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import { join } from 'path'

export interface DeployExecutorSchema {
  functionName: string
  runtime?: 'nodejs12' | 'nodejs14'
  entryPoint?: string
  serviceAccount?: string
  memory?: '128MB' | '256MB' | '512MB' | '1024MB' | '2048MB' | '4096MB'
  region: string
  envVarsFile?: string
  allowUnauthenticated?: boolean
  maxInstances?: number
  trigger?: 'http' | 'topic' | 'recourse' | 'bucket'
  triggerValue?: string
  triggerEvent?: string
  ingressSettings?: 'all' | 'internal-only' | 'internal-and-gclb'
  egressSettings?: 'all' | 'private-ranges-only'
  securityLevel?: 'secure-optional' | 'secure-always'
  project?: string
  retry?: boolean
  __runner?: {
    endpoint?: string
  }
}

export async function deployExecutor(
  options: DeployExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
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

  if (triggerValue && trigger === 'http') {
    throw new Error('"triggerValue" is not accepted when trigger is "http"!')
  }

  const { targets } = context.workspace.projects[context.projectName]

  return Promise.resolve(execCommand(buildCommand([
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

    `--source=${join(context.root, targets?.build?.options?.outputPath.toString())}`,
    `--max-instances=${maxInstances}`,

    allowUnauthenticated && '--allow-unauthenticated',
    serviceAccount && `--service-account=${serviceAccount}`,

    project && `--project=${project}`
  ])))
}

export default deployExecutor
