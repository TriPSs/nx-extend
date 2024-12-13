import { ExecutorContext, logger } from '@nx/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import { join, resolve } from 'path'

export interface UploadExecutorSchema {
  bucket: string
  directory?: string
  directories?: string[]
  gzip: boolean
  gzipExtensions?: string
}

export async function uploadExecutor(
  options: UploadExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { directory, directories, gzip = false, gzipExtensions, bucket } = options

  if (!directory && (!directories || directories.length === 0)) {
    throw new Error('"directory" is required!')
  }

  const uploadDirectories = directories || [`${directory}:/`]

  let success = true
  for (const uploadDirectory of uploadDirectories) {
    if (!uploadDirectory.includes(':')) {
      logger.error(`Invalid upload directory "${uploadDirectory}", must be in format "localPath:bucketPath"`)
      success = false
      break
    }

    const [localPath, bucketPath] = uploadDirectory.split(':')
    const directoryToUpload = join(context.root, localPath)
    const uploadTo = `gs://${bucket}${bucketPath}`

    logger.info(`Start upload assets from "${directoryToUpload}" to "${uploadTo}"`)

    const result = execCommand(buildCommand([
      'gsutil rsync -R',
      gzip && `-z "${gzipExtensions}"`,

      resolve(process.cwd(), directoryToUpload),
      uploadTo
    ]))

    if (!result.success) {
      success = false
      break
    }
  }

  return { success }
}

export default uploadExecutor
