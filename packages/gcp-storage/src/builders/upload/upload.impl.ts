import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { execCommand } from '@nx-extend/gcp-core'

import { UploadExecutorSchema } from './schema'

export async function runBuilder(
  options: UploadExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const {
    directory = '',
    bucket
  } = options

  const buildOptions = await context.getTargetOptions({
    project: context.target && context.target.project,
    target: 'build'
  })

  const directoryToUpload = `${buildOptions.outputPath.toString()}${directory}`
  const uploadTo = `gs://${bucket}`

  context.logger.info(`Start upload assets from "${directoryToUpload}" to "${uploadTo}"`)

  const gsutilCommand = [
    'gsutil rsync -R',
    directoryToUpload,
    uploadTo
  ]

  return execCommand(
    gsutilCommand.join(' '),
    {
      cwd: buildOptions.outputPath.toString()
    }
  )
}

export default createBuilder(runBuilder)
