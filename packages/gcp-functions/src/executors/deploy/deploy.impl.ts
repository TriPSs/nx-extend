import { ExecutorContext, logger } from '@nx/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import { join } from 'path'

import { Gen, ValidMemory } from '../../types'
import { getValidSecrets } from '../../utils/get-valid-secrets'
import { validateResources } from '../../utils/validate-resources'

export interface DeployExecutorSchema {
  functionName: string
  runtime?: 'nodejs16' | 'nodejs18' | 'nodejs20' | 'nodejs22' | 'nodejs24' | 'recommended'
  entryPoint?: string
  serviceAccount?: string
  memory?: ValidMemory
  region: string
  envVarsFile?: string
  envVars?: Record<string, string>
  allowUnauthenticated?: boolean
  maxInstances?: number
  trigger?: 'http' | 'topic' | 'recourse' | 'bucket'
  triggerValue?: string
  triggerEvent?: string
  triggerLocation?: string
  ingressSettings?: 'all' | 'internal-only' | 'internal-and-gclb'
  egressSettings?: 'all' | 'private-ranges-only'
  vpcConnector?: string
  securityLevel?: 'secure-optional' | 'secure-always'
  project?: string
  retry?: boolean
  secrets?: string[] | Record<string, string>

  // Gen 2 options
  gen?: Gen
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
    envVarsFile = null,
    envVars,
    maxInstances = 10,
    project = null,
    memory = '128MB',
    serviceAccount = null,
    entryPoint = null,
    retry = false,
    egressSettings = null,
    vpcConnector = null,
    securityLevel = null,
    secrets = [],
    gen = 2,
    concurrency = 1,
    cloudSqlInstance = null,
    timeout = null,
    cpu = 1
  } = options

  let runtime = options.runtime || 'nodejs20'
  // If "recommended" option is selected set the currently recommended one of Google (https://cloud.google.com/functions/docs/concepts/nodejs-runtime)
  if (runtime === 'recommended') {
    runtime = 'nodejs24'
  }

  // Options with default values based of trigger type
  const {
    ingressSettings = trigger === 'http' ? null : 'internal-only',

    allowUnauthenticated = trigger === 'http'
  } = options

  validateResources({ cpu, memory, gen })

  let correctMemory = memory as string
  let correctCPU = cpu as number

  if (gen === 2) {
    // Use the correct memory for the right gen
    if (memory.endsWith('MB')) {
      correctMemory = memory.replace('MB', 'Mi')
    }

    if (concurrency > 1 && correctCPU < 1) {
      logger.warn('Setting "cpu" to "1" because concurrency is higher the 1')
      correctCPU = 1
    }
  }

  if (triggerValue && trigger === 'http') {
    throw new Error('"triggerValue" is not accepted when trigger is "http"!')
  }

  const { targets } = context.projectsConfigurations.projects[context.projectName]

  const validSecrets = getValidSecrets(secrets)

  const setEnvVars = Object.keys(envVars || {}).reduce((env, envVar) => {
    env.push(`${envVar}=${envVars[envVar]}`)

    return env
  }, [])

  let { success } = execCommand(buildCommand([
    `gcloud functions deploy`,
    functionName,
    gen === 2 && '--gen2',
    `--trigger-${trigger}${triggerValue ? `=${triggerValue}` : ''}`,
    triggerEvent && `--trigger-event=${triggerEvent}`,
    triggerLocation && `--trigger-location=${triggerLocation}`,
    `--runtime=${runtime}`,
    `--memory=${correctMemory}`,
    `--region=${region}`,
    concurrency > 0 && `--concurrency=${concurrency}`,
    correctCPU && `--cpu=${correctCPU}`,

    entryPoint && `--entry-point=${entryPoint}`,
    envVarsFile && `--env-vars-file=${envVarsFile}`,
    setEnvVars.length > 0 && `--set-env-vars=${setEnvVars.join(',')}`,
    retry && `--retry`,
    ingressSettings && `--ingress-settings=${ingressSettings}`,
    egressSettings && `--egress-settings=${egressSettings}`,
    vpcConnector && `--vpc-connector=${vpcConnector}`,
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
  ]))

  if (
    success &&
    gen === 2 &&
    cloudSqlInstance
  ) {
    logger.info('Updating service with more configurations')

    const serviceUpdateCommand = execCommand(
      buildCommand([
        'gcloud run services update',
        functionName,

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
