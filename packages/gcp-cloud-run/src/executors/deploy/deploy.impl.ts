import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { execCommand, buildCommand } from '@nx-extend/core'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { ExecutorSchema } from '../schema'

export async function runBuilder(
  options: ExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)
  const buildOptions = await context.getTargetOptions({
    project: context.target && context.target.project,
    target: 'build'
  })

  const {
    region,
    project,
    name = projectMeta.prefix,
    allowUnauthenticated = true,
    envVars = {},
    concurrency = 250,
    maxInstances = 10,
    minInstances = 0,
    memory = '128Mi',
    cloudSqlInstance = null,
    http2 = false,
    serviceAccount = null
  } = options

  const dockerFile = readFileSync(
    join(context.workspaceRoot, options.dockerFile),
    'utf8'
  )

  const distDirectory = join(
    context.workspaceRoot,
    buildOptions.outputPath.toString()
  )

  const containerName = `gcr.io/${options.project}/${name}`

  // Add the docker file to the dist folder
  writeFileSync(join(distDirectory, 'Dockerfile'), dockerFile)

  const buildSubmitCommand = buildCommand([
    'gcloud builds submit',
    `--tag=${containerName}`,
    `--project=${options.project}`,
    options.tag ? `--tag=${options.tag}` : false
  ])

  console.log('\nRunning', buildSubmitCommand)

  const { success } = await execCommand(buildSubmitCommand, {
    cwd: distDirectory
  })

  if (success) {
    const setEnvVars = Object.keys(envVars).reduce((env, envVar) => {
      env.push(`${envVar}=${envVars[envVar]}`)

      return env
    }, [])

    const deployCommand = buildCommand([
      `gcloud beta run deploy ${name}`,
      `--image=${containerName}`,
      `--project=${project}`,
      '--platform=managed',
      `--memory=${memory}`,
      `--region=${region}`,
      `--min-instances=${minInstances}`,
      `--max-instances=${maxInstances}`,
      `--concurrency=${concurrency}`,
      serviceAccount ? `--service-account=${serviceAccount}` : false,
      http2 ? '--use-http2' : false,
      setEnvVars.length > 0 ? `--set-env-vars=${setEnvVars.join(',')}` : false,
      cloudSqlInstance ? `--add-cloudsql-instances=${cloudSqlInstance}` : false,
      allowUnauthenticated ? '--allow-unauthenticated' : false
    ])

    console.log('\nRunning', deployCommand)

    return execCommand(deployCommand, {
      cwd: distDirectory
    })
  }

  return { success: false }
}

export default createBuilder(runBuilder)
