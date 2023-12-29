import { ExecutorContext, logger } from '@nx/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import { join, resolve } from 'path'

export interface UploadExecutorSchema {
  bucket: string
  directory: string
  gzip: boolean
  gzipExtensions: string
}

export async function uploadExecutor(
  options: UploadExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { directory, gzip = false, gzipExtensions, bucket } = options

  if (!directory) {
    throw new Error('"directory" is required!')
  }

  const directoryToUpload = join(context.root, directory)

  const uploadTo = `gs://${bucket}`

  logger.info(`Start upload assets from "${directoryToUpload}" to "${uploadTo}"`)

  return Promise.resolve(
    execCommand(buildCommand([
      'gsutil rsync -R',
      gzip && `-z "${gzipExtensions}"`,

      resolve(process.cwd(), directoryToUpload),
      uploadTo
    ]))
  )
}

export default uploadExecutor
