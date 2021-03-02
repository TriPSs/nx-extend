import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { execCommand, buildCommand } from '@nx-extend/gcp-core'

import { ExecutorSchema } from '../schema'

import { isEncryptionKeySet, decryptFile } from '../../utils/encryption'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { getFileContent, getFileName, storeFile } from '../../utils/file'

export async function runBuilder(
  options: ExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)
  const projectRoot = `${context.workspaceRoot}/${projectMeta.root}`

  if (isEncryptionKeySet()) {
    try {
      const { output } = await execCommand(
        buildCommand([
          `gcloud secrets list`,
          '--format=json',
          getCommandOptions(options)
        ]),
        {
          cwd: context.workspaceRoot,
          silent: true
        }
      )

      const files = getAllSecretFiles(projectRoot)
      const existingSecrets: string[] = JSON.parse(output).map((secret) => secret.name.split('/secrets/').pop())

      const secretsCreated = await Promise.all(
        files.map(async (file) => {
          const fileName = getFileName(file)
          const fileNameParts = fileName.split('.')
          fileNameParts.pop()

          const secretName = fileNameParts.join('.')

          // Get the content of the file
          const fileContent = getFileContent(file)
          const isFileEncrypted = fileContent.__gcp_metadata.status === 'encrypted'

          // Decrypt the file if it's encrypted
          if (isFileEncrypted) {
            storeFile(file, decryptFile(fileContent, true))
          }

          const secretExists = existingSecrets.includes(secretName)
          let success

          // If the secret already exists we update it
          // and optionally remove older versions
          if (secretExists) {
            const updatedResult = await execCommand(
              buildCommand([
                `gcloud secrets update ${secretName}`,
                `--data-file="${file}"`,
                '--replication-policy=automatic',
                addLabelsIfNeeded(fileContent.__gcp_metadata.labels, false),
                getCommandOptions(options)
              ]),
              {
                cwd: context.workspaceRoot
              }
            )

            const updateBehavior = fileContent.__gcp_metadata.onUpdateBehavior || 'delete'

            if(updateBehavior !== 'none') {
              // TODO:: Get all now active versions and delete / disable all except the latest

              // gcloud secrets versions destroy 123 --secret=my-secret
              // gcloud secrets versions disable 123 --secret=my-secret
            }

            success = updatedResult.success

          } else {
            context.logger.info(`Creating secret "${secretName}" from file "${fileName}"`)

            const createdResult = await execCommand(
              buildCommand([
                `gcloud secrets create ${secretName}`,
                `--data-file="${file}"`,
                '--replication-policy=automatic',
                addLabelsIfNeeded(fileContent.__gcp_metadata.labels, true),
                getCommandOptions(options)
              ]),
              {
                cwd: context.workspaceRoot
              }
            )

            success = createdResult.success
          }

          // Store the encrypted file again
          if (isFileEncrypted) {
            storeFile(file, fileContent)
          }

          return success
        })
      )

      return {
        success: secretsCreated.filter(Boolean).length === files.length
      }

    } catch (err) {
      context.logger.error(`Error happend trying to decrypt files: ${err.message || err}`)
      console.error(err.trace)

      return { success: false }
    }

  } else {
    return { success: true }
  }
}

export const getCommandOptions = (options: ExecutorSchema): string => {
  return buildCommand([
    options.project
      ? `--project=${options.project}`
      : false
  ])
}

export const addLabelsIfNeeded = (labels: string[], isCreating: boolean): string => {
  if (labels.length > 0) {
    if (isCreating) {
      return buildCommand([
        `--labels=${labels.join(',')}`
      ])

    } else {
      return buildCommand([
        '--clear-labels',
        `--update-labels=${labels.join(',')}`
      ])
    }
  }

  return ''
}

export default createBuilder(runBuilder)
