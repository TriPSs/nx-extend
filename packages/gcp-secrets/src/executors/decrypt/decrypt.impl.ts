import { ExecutorContext, logger } from '@nrwl/devkit'

import { isEncryptionKeySet, decryptFile } from '../../utils/encryption'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { getFileContent, storeFile, SecretFile, getFileName } from '../../utils/file'

export async function decyrptExecutor(
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
        if (fileContent.__gcp_metadata.status === 'encrypted') {
          const encryptedFile: SecretFile = decryptFile(fileContent)

          // Store the encrypted file
          storeFile(file, encryptedFile)

          logger.info(`"${fileName}" decrypted`)

        } else {
          logger.info(`Skipping "${fileName}" because it's already decrypted`)
        }
      })

      return { success: true }
    } catch (err) {
      logger.error(`Error happened trying to decrypt files: ${err.message || err}`)
      console.error(err.trace)

      return { success: false }
    }

  } else {
    return { success: true }
  }
}

export default decyrptExecutor

