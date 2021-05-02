import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { buildCommand, execCommand } from '@nx-extend/core'
import { resolve } from 'path'

import { UploadExecutorSchema } from './schema'

export async function runBuilder(
  options: UploadExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const { directory, gzip = false, gzipExtensions, bucket } = options

  const buildOptions = await context.getTargetOptions({
    project: context.target && context.target.project,
    target: 'build'
  })

  const directoryToUpload = `${buildOptions.outputPath.toString()}${directory}`
  const uploadTo = `gs://${bucket}`

  context.logger.info(
    `Start upload assets from "${directoryToUpload}" to "${uploadTo}"`
  )

  return execCommand(buildCommand([
    'gsutil rsync -R',
    gzip ? `-z "${gzipExtensions}"` : false,
    resolve(process.cwd(), directoryToUpload),
    uploadTo
  ]), {
    cwd: buildOptions.outputPath.toString()
  })
}

export default createBuilder(runBuilder)
