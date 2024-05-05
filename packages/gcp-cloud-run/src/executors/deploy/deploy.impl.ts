import { ExecutorContext, logger, readJsonFile } from '@nx/devkit'
import { buildCommand, execCommand, getOutputDirectoryFromBuildTarget } from '@nx-extend/core'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { ContainerFlags, getContainerFlags } from './utils/get-container-flags'

export interface ExecutorSchema extends ContainerFlags {
  name?: string

  buildTarget?: string
  dockerFile: string
  project: string
  tag?: string
  region: string
  allowUnauthenticated?: boolean
  concurrency?: number
  maxInstances?: number
  minInstances?: number
  cloudSqlInstance?: string
  logsDir?: string
  serviceAccount?: string
  tagWithVersion?: string
  revisionSuffix?: string
  buildWith?: 'artifact-registry'
  noTraffic?: boolean
  timeout?: number
  cpuBoost?: boolean
  ingress?: string
  executionEnvironment?: 'gen1' | 'gen2'
  vpcConnector?: string
  vpcEgress?: 'all-traffic' | 'private-ranges-only'

  // VOLUME_NAME,type=cloud-storage,bucket=BUCKET_NAME
  // VOLUME_NAME,type=in-memory,size=SIZE_LIMIT
  volumeName?: string

  sidecars?: ContainerFlags[]

  // Global options
  dryRun?: boolean
}

export async function deployExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.workspace.projects[context.projectName]

  const buildTarget = options.buildTarget || `${context.projectName}:build`
  const outputDirectory = getOutputDirectoryFromBuildTarget(context, buildTarget)

  if (!outputDirectory) {
    throw new Error('Build target has no "outputPath" configured!')
  }

  const {
    region,
    project,
    name = context.projectName,
    allowUnauthenticated = true,
    concurrency,
    maxInstances,
    minInstances,
    cloudSqlInstance,
    serviceAccount,
    tagWithVersion = false,
    noTraffic = false,

    executionEnvironment,
    vpcConnector,
    vpcEgress,

    revisionSuffix = false,
    timeout,

    cpuBoost,
    ingress,
    // VOLUME_NAME,type=VOLUME_TYPE,size=SIZE_LIMIT'
    volumeName,

    sidecars = []
  } = options

  const distDirectory = join(context.root, outputDirectory)

  // If the user provided a Dockerfile, then write it to the dist directory
  if (options.dockerFile) {
    const dockerFile = readFileSync(
      join(context.root, options.dockerFile),
      'utf8'
    )

    // Add the docker file to the dist folder
    writeFileSync(join(distDirectory, 'Dockerfile'), dockerFile)
  }

  let packageVersion = null

  if (tagWithVersion) {
    const packageJsonLocation = join(context.root, `${root}`, 'package.json')

    if (existsSync(packageJsonLocation)) {
      const packageJson = readJsonFile(packageJsonLocation)

      if (packageJson && packageJson.version) {
        packageVersion = `v${packageJson.version.replace(/\./g, '-')}`
      }
    }
  }

  let gcloudDeploy = 'gcloud run deploy'
  if (options.volumeName) {
    logger.warn('Volumes are still in beta, using "gcloud beta" to deploy.\n')

    gcloudDeploy = 'gcloud beta run deploy'
  }

  const deployCommand = buildCommand([
    `${gcloudDeploy} ${name}`,
    `--project=${project}`,
    '--platform=managed',
    `--region=${region}`,
    `--min-instances=${minInstances}`,
    `--max-instances=${maxInstances}`,
    `--concurrency=${concurrency}`,
    executionEnvironment && `--execution-environment=${executionEnvironment}`,
    vpcConnector && `--vpc-connector=${vpcConnector}`,
    vpcEgress && `--vpc-egress=${vpcEgress}`,
    ingress && `--ingress=${ingress}`,
    revisionSuffix && `--revision-suffix=${revisionSuffix}`,
    serviceAccount && `--service-account=${serviceAccount}`,
    timeout && `--timeout=${timeout}`,
    cloudSqlInstance && `--add-cloudsql-instances=${cloudSqlInstance}`,
    tagWithVersion && packageVersion && `--tag=${packageVersion}`,
    typeof cpuBoost === 'boolean' && cpuBoost && '--cpu-boost',
    typeof cpuBoost === 'boolean' && !cpuBoost && '--no-cpu-boost',
    noTraffic && '--no-traffic',
    allowUnauthenticated && '--allow-unauthenticated',
    volumeName && `--add-volume=name=${volumeName}`,

    // Add the primary container
    ...getContainerFlags(options, sidecars.length > 0),

    // Add all sidecars
    ...sidecars.flatMap((sidecarOptions) => getContainerFlags(sidecarOptions, true)),

    '--quiet'
  ])

  return execCommand(deployCommand, {
    cwd: distDirectory
  }, options.dryRun)
}

export default deployExecutor
