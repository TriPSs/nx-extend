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
    serviceAccount = null,
    logsDir = false,
    tagWithVersion = false
  } = options

  const distDirectory = join(
    context.workspaceRoot,
    buildOptions.outputPath.toString()
  )

  const containerName = `gcr.io/${options.project}/${name}`

  // If the user provided a dockerfile then write it to the dist direcotry
  if (options.dockerFile) {
    const dockerFile = readFileSync(
      join(context.workspaceRoot, options.dockerFile),
      'utf8'
    )

    // Add the docker file to the dist folder
    writeFileSync(join(distDirectory, 'Dockerfile'), dockerFile)
  }

  const buildSubmitCommand = buildCommand([
    'gcloud builds submit',
    `--tag=${containerName}`,
    `--project=${options.project}`,
    logsDir ? `--gcs-log-dir=${logsDir}` : false,
    options.tag ? `--tag=${options.tag}` : false
  ])

  console.log('\nRunning', buildSubmitCommand)

  const { success } = execCommand(buildSubmitCommand, {
    cwd: distDirectory
  })

  if (success) {
    const setEnvVars = Object.keys(envVars).reduce((env, envVar) => {
      env.push(`${envVar}=${envVars[envVar]}`)

      return env
    }, [])

    const deployCommand = buildCommand([
      `gcloud run deploy ${name}`,
      '--source=./',
      // `--image=${containerName}`,
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
      allowUnauthenticated ? '--allow-unauthenticated' : false,
      tagWithVersion ? '--tag=${package json version number here}' : false
    ])

    console.log('\nRunning', deployCommand)

    return execCommand(deployCommand, {
      cwd: distDirectory
    })
  }

  return { success: false }
}

export default createBuilder(runBuilder)


// Check if this works and if the tag is also added to inside the container registery
// gcloud run deploy main --source=./ --project=straetus-app --tag=0.3.0 --platform=managed --memory=256Mi --region=europe-west4 --min-instances=0 --max-instances=4 --concurrency=200 --service-account=api-main@***.iam.gserviceaccount.com --set-env-vars=DB_HOST=***:europe-west4:straetus-db-eu,DB_USERNAME=straetus_main_api,TZ=UTC --add-cloudsql-instances=***:europe-west4:straetus-db-eu --allow-unauthenticated
