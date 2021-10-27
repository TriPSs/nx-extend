import { ExecutorContext, logger } from '@nrwl/devkit'

import { isEncryptionKeySet, encryptFile } from '../../utils/encryption'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { getFileContent, storeFile, SecretFile, getFileName } from '../../utils/file'

export async function encryptExecutor(
  options,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot } = context.workspace.projects[context.projectName]

  if (isEncryptionKeySet()) {
    try {
      const files = getAllSecretFiles(sourceRoot)

      files.map((file) => {
        const fileName = getFileName(file)

        // Get the content of the file
        const fileContent = getFileContent(file)

        // Double check if the current file is decrypted
        if (fileContent.__gcp_metadata.status === 'decrypted') {
          const encryptedFile: SecretFile = encryptFile(fileContent)

          // Store the encrypted file
          storeFile(file, encryptedFile)

          logger.info(`"${fileName}" encrypted`)

        } else {
          logger.info(`Skipping "${fileName}" because it's already encrypted`)
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
