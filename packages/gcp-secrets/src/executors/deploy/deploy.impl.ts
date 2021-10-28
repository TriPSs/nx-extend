import { ExecutorContext, logger } from '@nrwl/devkit'
import { execCommand, buildCommand } from '@nx-extend/core'
import { echo } from 'shelljs'
import { yellow } from 'chalk'

import { isEncryptionKeySet, decryptFile } from '../../utils/encryption'
import { getAllSecretFiles } from '../../utils/get-all-secret-files'
import { getFileContent, getFileName, storeFile } from '../../utils/file'

export interface DeploySchema {

  project?: string

}

export interface ExistingSecret {
  name: string;

  labels?: {
    [key: string]: string
  }
}

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

        // Get the content of the file
        const fileContent = getFileContent(file)
        const isFileEncrypted = fileContent.__gcp_metadata.status === 'encrypted'

        // Decrypt the file if it's encrypted
        if (isFileEncrypted) {
          storeFile(file, decryptFile(fileContent, true))
        }

        // Check if the secret exists
        const secretExists = existingSecrets.find(
          (secret) => secret.name === secretName
        )
        let success

        // If the secret already exists we update it
        // and optionally remove older versions
        if (secretExists) {
          const existingLabels = Object.keys(secretExists?.labels || {}).reduce((labels, labelKey) => {
            labels.push(`${labelKey}=${secretExists.labels[labelKey]}`)

            return labels
          }, [])

          // Check if we need to update the sercrets labels
          if (JSON.stringify(existingLabels) !== JSON.stringify(fileContent.__gcp_metadata.labels)) {
            echo(`Updating "${secretName}" it's labels`)

            execCommand(buildCommand([
              `gcloud secrets update ${secretName}`,
              addLabelsIfNeeded(fileContent.__gcp_metadata.labels, false),
              getCommandOptions(options)
            ]), {
              silent: true
            })
          }

          // Get the new version of the secret
          const newVersion = execCommand<{ name: string }>(
            buildCommand([
              `gcloud secrets versions add ${secretName}`,
              `--data-file="${file}"`,
              '--format=json',
              getCommandOptions(options)
            ]),
            {
              asJSON: true,
              silent: true
            }
          ).name.split('/versions/').pop()

          const updateBehavior = fileContent.__gcp_metadata.onUpdateBehavior || 'destroy'

          if (updateBehavior !== 'none') {
            if (['destroy', 'disable'].includes(updateBehavior)) {
              const previousVersion = parseInt(newVersion, 10) - 1

              echo(`${updateBehavior === 'disable' ? 'Disabling' : 'Destroying'} previous version of secret "${secretName}"`)

              execCommand(buildCommand([
                `gcloud secrets versions ${updateBehavior} ${previousVersion}`,
                `--secret=${secretName}`,
                '--quiet',

                getCommandOptions(options)
              ]))

            } else {
              echo(yellow(`"${updateBehavior}" is an invalid onUpdateBehavior, valid are: "none", "disable" or "destroy"`))
            }
          }

          success = true
        } else {
          logger.info(`Creating secret "${secretName}" from file "${fileName}"`)

          const { success: commandSuccess } = execCommand(
            buildCommand([
              `gcloud secrets create ${secretName}`,
              `--data-file="${file}"`,
              '--replication-policy=automatic',
              addLabelsIfNeeded(fileContent.__gcp_metadata.labels, true),
              getCommandOptions(options)
            ]),
            {
              fatal: true
            }
          )

          success = commandSuccess
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
