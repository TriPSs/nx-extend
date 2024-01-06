import { ExecutorContext, logger, readJsonFile } from '@nx/devkit'
import { buildCommand, execCommand, getOutputDirectoryFromBuildTarget } from '@nx-extend/core'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { ExecutorSchema } from '../schema'

export async function deployExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root, sourceRoot } = context.workspace.projects[context.projectName]

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
    envVars = {},
    concurrency = 250,
    maxInstances = 10,
    minInstances = 0,
    memory = '128Mi',
    cloudSqlInstance = null,
    http2 = false,
    serviceAccount = null,
    logsDir = false,
    tagWithVersion = false,
    noTraffic = false,
    secrets = [],

    revisionSuffix = false,
    buildWith = 'artifact-registry',
    autoCreateArtifactsRepo = true,
    generateRepoInfoFile = false,
    timeout = null,

    cpu,
    cpuBoost,
    ingress
  } = options

  const distDirectory = join(context.root, outputDirectory)

  const buildWithArtifactRegistry = buildWith === 'artifact-registry'
  const containerName = `gcr.io/${options.project}/${name}`

  // If the user provided a dockerfile then write it to the dist directory
  if (options.dockerFile) {
    const dockerFile = readFileSync(
      join(context.root, options.dockerFile),
      'utf8'
    )

    // Add the docker file to the dist folder
    writeFileSync(join(distDirectory, 'Dockerfile'), dockerFile)
  }

  if (!buildWithArtifactRegistry) {
    const buildSubmitCommand = buildCommand([
      'gcloud builds submit',
      `--tag=${containerName}`,
      `--project=${options.project}`,
      logsDir ? `--gcs-log-dir=${logsDir}` : false
    ])

    const { success } = execCommand(buildSubmitCommand, {
      cwd: distDirectory
    })

    if (!success) {
      throw new Error('Failed building container!')
    }
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

  const setEnvVars = Object.keys(envVars).reduce((env, envVar) => {
    env.push(`${envVar}=${envVars[envVar]}`)

    return env
  }, [])

  const validSecrets = secrets
    .map((secret) => {
      if (secret.includes('=') && secret.includes(':')) {
        return secret
      }

      logger.warn(`"${secret}" is not a valid secret! It should be in the following format "ENV_VAR_NAME=SECRET:VERSION"`)
      return false
    })
    .filter(Boolean)

  const ingressOpts = ['all', 'internal', 'internal-and-cloud-load-balancing']
  if (ingress && !ingressOpts.includes(ingress)) {
    logger.error(`"${ingress}" is not a valid ingress option! Only the following few options are supported: ${ingressOpts}`)

    return { success: false }
  }

  // @TODO(mkdior) - cd deprecated, should we remove?
  if (generateRepoInfoFile) {
    logger.info('Generating repo info file')

    execCommand(buildCommand([
      'gcloud debug source gen-repo-info-file',
      `--source-directory=${sourceRoot || './'}`,
      `--output-directory=${distDirectory}`
    ]))
  }

  const deployCommand = buildCommand([
    `gcloud run deploy ${name}`,
    !buildWithArtifactRegistry && `--image=${containerName}`,
    buildWithArtifactRegistry && '--source=./',
    `--project=${project}`,
    '--platform=managed',
    `--memory=${memory}`,
    `--region=${region}`,
    `--min-instances=${minInstances}`,
    `--max-instances=${maxInstances}`,
    `--concurrency=${concurrency}`,
    revisionSuffix && `--revision-suffix=${revisionSuffix}`,
    serviceAccount && `--service-account=${serviceAccount}`,
    http2 && '--use-http2',
    noTraffic && '--no-traffic',
    timeout && `--timeout=${timeout}`,
    setEnvVars.length > 0 && `--set-env-vars=${setEnvVars.join(',')}`,
    cloudSqlInstance && `--add-cloudsql-instances=${cloudSqlInstance}`,
    allowUnauthenticated && '--allow-unauthenticated',
    tagWithVersion && packageVersion && `--tag=${packageVersion}`,
    validSecrets.length > 0 && `--set-secrets=${validSecrets.join(',')}`,

    cpu && `--cpu=${cpu}`,
    typeof cpuBoost === 'boolean' && cpuBoost && '--cpu-boost',
    typeof cpuBoost === 'boolean' && !cpuBoost && '--no-cpu-boost',

    // There can be a question if a repo should be created
    buildWithArtifactRegistry && autoCreateArtifactsRepo && '--quiet',

    ingress && `--ingress=${ingress}`
  ])

  return execCommand(deployCommand, {
    cwd: distDirectory
  })
}

export default deployExecutor
