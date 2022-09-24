import { ExecutorContext, logger } from '@nrwl/devkit'
import { buildCommand,execCommand } from '@nx-extend/core'
import { existsSync, mkdirSync,unlinkSync, writeFileSync } from 'fs'

import { addOrUpdateSecret } from '../../utils/add-or-update-secret'
import { decryptFile,isEncryptionKeySet } from '../../utils/encryption'
import { getFileContent, getFileName, storeFile } from '../../utils/file'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { SharedOptions } from '../shared-options'

export interface DeploySchema extends SharedOptions{
  project?: string
}

export interface ExistingSecret {
  name: string

  labels?: {
    [key: string]: string
  }
}

export interface ExistingServiceAccounts {
  bindings: {
    members: string[]
    role: string
  }[]
}

/**
 * TODO:: Refactor to use the node sdk
 *  https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets#secretmanager-create-secret-nodejs
 */
export async function deployExecutor(
  options: DeploySchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot } = context.workspace.projects[context.projectName]

  if (isEncryptionKeySet()) {
    try {
      const existingSecrets = execCommand<ExistingSecret[]>(
        buildCommand([
          `gcloud secrets list`,
          '--format=json',
          getCommandOptions(options)
        ]),
        {
          silent: true,
          asJSON: true
        }
      ).map((secret) => ({
        ...secret,
        name: secret.name.split('/secrets/').pop()
      }))

      const files = getAllSecretFiles(sourceRoot)

      const secretsCreated = await Promise.all(files.map(async (file) => {
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
        const isFileEncrypted = fileContent.__gcp_metadata.status === 'encrypted'
        const decryptedFileContent = decryptFile(fileContent, true)

        // Decrypt the file if it's encrypted
        if (isFileEncrypted) {
          storeFile(file, decryptedFileContent)
        }

        let success = false

        if (!fileContent.__gcp_metadata.keysAreSecrets) {
          // Add the file as secret
          success = addOrUpdateSecret(
            existingSecrets,
            secretName,
            fileContent.__gcp_metadata,
            file,
            options
          )

        } else {
          const tmpDirectory = `${context.root}/tmp`

          // Create the tmp directory if it does not exists
          if (!existsSync(tmpDirectory)) {
            mkdirSync(tmpDirectory, { recursive: true })
          }

          Object.keys(fileContent).forEach((secretName) => {
            success = true

            // Don't create the metadata and expect success to still be true
            if (secretName !== '__gcp_metadata' && success) {
              const tmpSecretLocation = `${tmpDirectory}/${secretName}`
              // Create the tmp secret file
              writeFileSync(
                tmpSecretLocation,
                typeof decryptedFileContent[secretName] !== 'string'
                  ? JSON.stringify(decryptedFileContent[secretName])
                  : decryptedFileContent[secretName]
              )

              success = addOrUpdateSecret(
                existingSecrets,
                secretName,
                fileContent.__gcp_metadata,
                tmpSecretLocation,
                options
              )

              // Remove the tmp file
              unlinkSync(tmpSecretLocation)
            }
          })
        }

        // Store the encrypted file again
        if (isFileEncrypted) {
          storeFile(file, fileContent)
        }

        return success
      }))

      return {
        success: secretsCreated.filter(Boolean).length === files.length
      }
    } catch (err) {
      logger.error(`Error happened trying to decrypt files: ${err.message || err}`)
      console.error(err.trace)

      return { success: false }
    }
  } else {
    return { success: true }
  }
}

export const getCommandOptions = (options: DeploySchema): string => {
  return buildCommand([
    options.project && `--project=${options.project}`
  ])
}

export const addLabelsIfNeeded = (
  labels: string[],
  isCreating: boolean
): string => {
  if (labels.length > 0) {
    if (isCreating) {
      return buildCommand([`--labels=${labels.join(',')}`])

    } else {
      return buildCommand([
        '--clear-labels',
        `--update-labels=${labels.join(',')}`
      ])
    }
  } else {
    return buildCommand([
      '--clear-labels'
    ])
  }
}

export default deployExecutor
