import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { execCommand } from '@nx-extend/gcp-core'
import { resolve } from 'path'

import { DeployExecutorSchema } from './schema'

export async function runBuilder(
  options: DeployExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const {
    functionName,
    region,
    trigger = 'http',
    triggerValue = null,
    runtime = 'nodejs12',
    allowUnauthenticated = true,
    envVarsFile = null,
    maxInstances = 10,
    project = null
  } = options

  const buildOptions = await context.getTargetOptions({
    project: context.target && context.target.project,
    target: 'build'
  })

  const sourceDirectory = resolve(
    process.cwd(),
    buildOptions.outputPath.toString()
  )

  context.logger.info(`Deploy function "${functionName}" with source from "${sourceDirectory}"`)

  const gcloudCommand = [
    'gcloud functions deploy',
    functionName,
    `--trigger-${trigger}${triggerValue ? `=${triggerValue}` : ''}`,
    `--runtime=${runtime}`,
    `--region=${region}`,

    envVarsFile
      ? `--env-vars-file=${envVarsFile}`
      : false,

    `--source=${sourceDirectory}`,
    `--max-instances=${maxInstances}`,

    allowUnauthenticated
      ? '--allow-unauthenticated' :
      false,

    project
      ? `--project=${project}`
      : false
  ].filter(Boolean)

  return execCommand(gcloudCommand.join(' '))
}

export default createBuilder(runBuilder)
