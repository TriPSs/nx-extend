import { ExecutorContext, logger } from '@nrwl/devkit'
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
  const { targets } = context.workspace.projects[context.projectName]
  const { directory, gzip = false, gzipExtensions, bucket } = options

  const directoryToUpload = join(
    join(context.root, targets?.build?.options?.outputPath.toString()),
    directory
  )

  const uploadTo = `gs://${bucket}`

  logger.info(`Start upload assets from "${directoryToUpload}" to "${uploadTo}"`)

  return Promise.resolve(execCommand(buildCommand([
    'gsutil rsync -R',
    gzip && `-z "${gzipExtensions}"`,

    resolve(process.cwd(), directoryToUpload),
    uploadTo
  ])))
}

export default uploadExecutor
