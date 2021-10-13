import { createBuilder, BuilderContext } from '@angular-devkit/architect'

import { ExecutorSchema } from '../schema'

import { isEncryptionKeySet, decryptFile } from '../../utils/encryption'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { getFileContent, storeFile, SecretFile, getFileName } from '../../utils/file'

export async function runBuilder(
  options: ExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)
  const projectSourceRoot = `${context.workspaceRoot}/${projectMeta.sourceRoot}`

  if (isEncryptionKeySet()) {
    try {
      const files = getAllSecretFiles(projectSourceRoot)

      files.map((file) => {
        const fileName = getFileName(file)

        // Get the content of the file
        const fileContent = getFileContent(file)

        // Double check if the current file is decrypted
        if (fileContent.__gcp_metadata.status === 'encrypted') {
          const encryptedFile: SecretFile = decryptFile(fileContent)

          // Store the encrypted file
          storeFile(file, encryptedFile)

          context.logger.info(`"${fileName}" decrypted`)

        } else {
          context.logger.info(`Skipping "${fileName}" because it's already decrypted`)
        }
      })

      return { success: true }
    } catch (err) {
      context.logger.error(`Error happened trying to decrypt files: ${err.message || err}`)
      console.error(err.trace)

      return { success: false }
    }

  } else {
    return { success: true }
  }
}

export default createBuilder(runBuilder)
