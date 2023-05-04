import { ExecutorContext, logger } from '@nx/devkit'

import { decryptFile, isEncryptionKeySet } from '../../utils/encryption'
import {
  getFileContent,
  getFileName,
  SecretFile,
  storeFile
} from '../../utils/file'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { SharedOptions } from '../shared-options'

export async function decyrptExecutor(
  options: SharedOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot } = context.workspace.projects[context.projectName]

  if (isEncryptionKeySet()) {
    try {
      const files = getAllSecretFiles(sourceRoot)

      files.map((file) => {
        const fileName = getFileName(file)
        const fileNameParts = fileName.split('.')
        fileNameParts.pop()

        const secretName = fileNameParts.join('.')

        // Check if we should only deploy this secret
        if (options.secret && options.secret !== secretName) {
          return true
        }

        // Get the content of the file
        const fileContent = getFileContent(file)

        // Double check if the current file is decrypted
        if (fileContent.__gcp_metadata.status === 'encrypted') {
          const encryptedFile: SecretFile = decryptFile(fileContent)

          // Store the encrypted file
          storeFile(file, encryptedFile)

          logger.info(`"${secretName}" decrypted`)
        } else {
          logger.info(`Skipping "${secretName}" because it's already decrypted`)
        }
      })

      return { success: true }
    } catch (err) {
      logger.error(
        `Error happened trying to decrypt files: ${err.message || err}`
      )
      console.error(err.trace)

      return { success: false }
    }
  } else {
    return { success: true }
  }
}

export default decyrptExecutor
