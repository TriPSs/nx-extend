import { execCommand, buildCommand } from '@nx-extend/core'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { ExecutorContext, readJsonFile } from '@nrwl/devkit'
import { join } from 'path'

import { ExecutorSchema } from '../schema'

export function deployExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root, targets } = context.workspace.projects[context.projectName]

  if (!targets?.build?.options?.outputPath) {
    throw new Error('No build target configured!')
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

    revisionSuffix = false,
    buildWith = 'artifact-registry',
    autoCreateArtifactsRepo = true
  } = options

  const distDirectory = join(
    context.root,
    targets?.build?.options?.outputPath.toString()
  )

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

    console.log('\nRunning', buildSubmitCommand)

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
    setEnvVars.length > 0 && `--set-env-vars=${setEnvVars.join(',')}`,
    cloudSqlInstance && `--add-cloudsql-instances=${cloudSqlInstance}`,
    allowUnauthenticated && '--allow-unauthenticated',
    tagWithVersion && packageVersion && `--tag=${packageVersion}`,

    // There can be a question if a repo should be created
    buildWithArtifactRegistry && autoCreateArtifactsRepo && '--quiet'
  ])

  console.log('\nRunning', deployCommand)

  return Promise.resolve(execCommand(deployCommand, {
    cwd: distDirectory
  }))
}

export default deployExecutor
