import { ExecutorContext, logger } from '@nrwl/devkit'
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
  secrets?: string[]

  // Gen 2 options
  gen?: 1 | 2
  concurrency?: number
  cloudSqlInstance?: string

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
    securityLevel = null,
    secrets = [],
    gen = 1,
    concurrency = 1,
    cloudSqlInstance = null,
  } = options

  let correctMemory = memory as string

  // Use the correct memory for the right gen
  if (gen === 2 && memory.endsWith('MB')) {
    correctMemory = memory.replace('MB', 'Mi')
  }

  if (triggerValue && trigger === 'http') {
    throw new Error('"triggerValue" is not accepted when trigger is "http"!')
  }

  const { targets } = context.workspace.projects[context.projectName]

  const validSecrets = secrets.map((secret) => {
    if (secret.includes('=') && secret.includes(':')) {
      return secret
    }

    logger.warn(`"${secret}" is not a valid secret! It should be in the following format "ENV_VAR_NAME=SECRET:VERSION"`)
    return false
  }).filter(Boolean)

  let gcloudCommand = 'gcloud'
  if (validSecrets.length > 0 && gen === 1) {
    logger.info('Using secrets, install beta components to be sure')
    gcloudCommand = 'gcloud beta'

    execCommand('gcloud components install beta')

  } else if (gen === 2) {
    logger.info('Using gen 2, install alpha components to be sure')
    gcloudCommand = 'gcloud alpha'

    execCommand('gcloud components install alpha')
  }

  const { success } = execCommand(buildCommand([
    `${gcloudCommand} functions deploy`,
    functionName,
    gen === 2 && '--gen2',
    `--trigger-${trigger}${triggerValue ? `=${triggerValue}` : ''}`,
    triggerEvent && `--trigger-event=${triggerEvent}`,
    `--runtime=${runtime}`,
    `--memory=${correctMemory}`,
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

    gen === 1 && validSecrets.length > 0 && `--set-secrets=${validSecrets.join(',')}`,

    project && `--project=${project}`
  ]))

  if (gen === 2 && (concurrency > 0 || validSecrets.length > 0)) {
    if (concurrency > 1) {
      logger.info('Updating service with more configurations')

      execCommand(buildCommand([
        `${gcloudCommand} run services update`,
        functionName,

        concurrency > 0 && `--concurrency ${concurrency}`,
        validSecrets.length > 0 && `--set-secrets=${validSecrets.join(',')}`,
        cloudSqlInstance && `--add-cloudsql-instances=${cloudSqlInstance}`,

        `--region=${region}`,
        project && `--project=${project}`
      ]))
    }
  }

  return Promise.resolve({ success })
}

export default deployExecutor
