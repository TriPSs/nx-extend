import { ExecutorContext, logger } from '@nx/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import { join } from 'path'

export interface DeployExecutorSchema {
  functionName: string
  runtime?: 'nodejs12' | 'nodejs14' | 'nodejs16' | 'nodejs18' | 'recommended'
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
  triggerLocation?: string
  ingressSettings?: 'all' | 'internal-only' | 'internal-and-gclb'
  egressSettings?: 'all' | 'private-ranges-only'
  securityLevel?: 'secure-optional' | 'secure-always'
  project?: string
  retry?: boolean
  secrets?: string[]

  // Gen 2 options
  gen?: 1 | 2
  concurrency?: number
  timeout?: number
  cloudSqlInstance?: string
  cpu?: number
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
    triggerLocation = null,
    runtime = 'nodejs16',
    envVarsFile = null,
    maxInstances = 10,
    project = null,
    memory = '128MB',
    serviceAccount = null,
    entryPoint = null,
    retry = false,
    egressSettings = null,
    securityLevel = null,
    secrets = [],
    gen = 1,
    concurrency = 1,
    cloudSqlInstance = null,
    timeout = null,
    cpu = 1
  } = options

  // If "recommended" option is selected set the currently recommended one of Google (https://cloud.google.com/functions/docs/concepts/nodejs-runtime)
  if (options.runtime === 'recommended') {
    options.runtime = 'nodejs18'
  }

  // Options with default values based of trigger type
  const {
    ingressSettings = trigger === 'http' ? null : 'internal-only',

    allowUnauthenticated = trigger === 'http'
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

  const validSecrets = secrets
    .map((secret) => {
      if (secret.includes('=') && secret.includes(':')) {
        return secret
      }

      logger.warn(
        `"${secret}" is not a valid secret! It should be in the following format "ENV_VAR_NAME=SECRET:VERSION"`
      )
      return false
    })
    .filter(Boolean)

  let gcloudCommand = 'gcloud'
  if (validSecrets.length > 0 && gen === 1) {
    logger.info('Using secrets, use gcloud beta')
    gcloudCommand = 'gcloud beta'
  } else if (gen === 2) {
    logger.info('Using gen 2, use gcloud alpha')
    gcloudCommand = 'gcloud alpha'
  }

  let { success } = execCommand(
    buildCommand([
      `${gcloudCommand} functions deploy`,
      functionName,
      gen === 2 && '--gen2',
      `--trigger-${trigger}${triggerValue ? `=${triggerValue}` : ''}`,
      triggerEvent && `--trigger-event=${triggerEvent}`,
      triggerLocation && `--trigger-location=${triggerLocation}`,
      `--runtime=${runtime}`,
      `--memory=${correctMemory}`,
      `--region=${region}`,

      entryPoint && `--entry-point=${entryPoint}`,
      envVarsFile && `--env-vars-file=${envVarsFile}`,
      retry && `--retry`,
      ingressSettings && `--ingress-settings=${ingressSettings}`,
      egressSettings && `--egress-settings=${egressSettings}`,
      securityLevel && `--security-level=${securityLevel}`,
      timeout && `--timeout=${timeout}`,

      `--source=${join(
        context.root,
        targets?.build?.options?.outputPath.toString()
      )}`,
      `--max-instances=${maxInstances}`,

      allowUnauthenticated && '--allow-unauthenticated',
      serviceAccount && `--service-account=${serviceAccount}`,

      validSecrets.length > 0 && `--set-secrets=${validSecrets.join(',')}`,

      project && `--project=${project}`,

      '--quiet'
    ])
  )

  if (
    success &&
    gen === 2 &&
    (concurrency > 0 || validSecrets.length > 0 || cloudSqlInstance)
  ) {
    logger.info('Updating service with more configurations')

    const serviceUpdateCommand = execCommand(
      buildCommand([
        `${gcloudCommand} run services update`,
        functionName,

        concurrency > 0 && `--concurrency ${concurrency}`,
        cpu && `--cpu ${cpu}`,
        cloudSqlInstance && `--add-cloudsql-instances=${cloudSqlInstance}`,

        `--region=${region}`,
        project && `--project=${project}`,

        '--quiet'
      ])
    )

    success = serviceUpdateCommand.success
  }

  return Promise.resolve({ success })
}

export default deployExecutor
