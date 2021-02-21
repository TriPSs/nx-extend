import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { execCommand } from '@nx-extend/gcp-core'
import { resolve } from 'path'

import { UploadExecutorSchema } from './schema'

export async function runBuilder(
  options: UploadExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const {
    directory,
    gzip = false,
    gzipExtensions,
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
    gzip
      ? `-z "${gzipExtensions}"`
      : false,
    resolve(
      process.cwd(),
      directoryToUpload
    ),
    uploadTo
  ].filter(Boolean)

  return execCommand(
    gsutilCommand.join(' '),
    {
      cwd: buildOptions.outputPath.toString()
    }
  )
}

export default createBuilder(runBuilder)
