import { ExecutorContext, logger } from '@nrwl/devkit'

import { encryptFile, isEncryptionKeySet } from '../../utils/encryption'
import { getFileContent, getFileName, SecretFile, storeFile } from '../../utils/file'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { SharedOptions } from '../shared-options'

export async function encryptExecutor(
  options: SharedOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot } = context.workspace.projects[context.projectName]

  if (isEncryptionKeySet()) {
    try {
      const files = getAllSecretFiles(sourceRoot)

      files.map((file) => {
        const secretName = getFileName(file)

        // Check if we should only deploy this secret
        if (options.secret && options.secret !== secretName) {
          return true
        }

        // Get the content of the file
        const fileContent = getFileContent(file)

        // Double check if the current file is decrypted
        if (fileContent.__gcp_metadata.status === 'decrypted') {
          const encryptedFile: SecretFile = encryptFile(fileContent)

          // Store the encrypted file
          storeFile(file, encryptedFile)

          logger.info(`"${secretName}" encrypted`)

        } else {
          logger.info(`Skipping "${secretName}" because it's already encrypted`)
        }
      })

      return { success: true }
    } catch (err) {
      logger.error(`Error happened trying to encrypt files: ${err.message || err}`)
      console.error(err.trace)

      return { success: false }
    }

  } else {
    return { success: true }
  }
}

export default encryptExecutor
