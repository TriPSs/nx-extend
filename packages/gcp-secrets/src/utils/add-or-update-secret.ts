import { logger } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import chalk from 'chalk'

import {
  addLabelsIfNeeded,
  DeploySchema,
  ExistingSecret,
  ExistingServiceAccounts,
  getCommandOptions
} from '../executors/deploy/deploy.impl'
import { SecretMetadata } from './file'

export const addOrUpdateSecret = (
  existingSecrets: ExistingSecret[],
  secretName: string,
  metadata: SecretMetadata,
  secretOrSecretFileLocation: string,
  options: DeploySchema
) => {
  // Check if the secret exists
  const secretExists = existingSecrets.find((secret) => secret.name === secretName)

  let execCommandResult = {
    success: false
  }

  // If the secret already exists we update it
  // and optionally remove older versions
  if (secretExists) {
    const existingLabels = Object.keys(secretExists?.labels || {}).reduce((labels, labelKey) => {
      labels.push(`${labelKey}=${secretExists.labels[labelKey]}`)

      return labels
    }, [])

    // Check if we need to update the secrets labels
    if (JSON.stringify(existingLabels) !== JSON.stringify(metadata.labels)) {
      logger.info(`Updating "${secretName}" it's labels`)

      execCommand(buildCommand([
        `gcloud secrets update ${secretName}`,
        addLabelsIfNeeded(metadata.labels, false),
        getCommandOptions(options)
      ]), {
        silent: true
      })
    }

    // Get the new version of the secret
    const newVersion = execCommand<{ name: string }>(
      buildCommand([
        `gcloud secrets versions add ${secretName}`,
        `--data-file="${secretOrSecretFileLocation}"`,
        '--format=json',
        getCommandOptions(options)
      ]),
      {
        asJSON: true,
        silent: true
      }
    ).name.split('/versions/').pop()

    const updateBehavior = metadata.onUpdateBehavior || 'destroy'

    if (updateBehavior !== 'none') {
      if (['destroy', 'disable'].includes(updateBehavior)) {
        const previousVersion = parseInt(newVersion, 10) - 1

        logger.info(`${updateBehavior === 'disable' ? 'Disabling' : 'Destroying'} previous version of secret "${secretName}"`)

        execCommandResult = execCommand(buildCommand([
          `gcloud secrets versions ${updateBehavior} ${previousVersion}`,
          `--secret=${secretName}`,
          '--quiet',

          getCommandOptions(options)
        ]))

      } else {
        logger.warn(chalk.yellow(`"${updateBehavior}" is an invalid onUpdateBehavior, valid are: "none", "disable" or "destroy"`))
      }
    }
  } else {
    logger.info(`Creating secret "${secretName}"`)

    execCommandResult = execCommand(
      buildCommand([
        `gcloud secrets create ${secretName}`,
        `--data-file="${secretOrSecretFileLocation}"`,
        '--replication-policy=automatic',
        addLabelsIfNeeded(metadata.labels, true),
        getCommandOptions(options)
      ]),
      {
        fatal: true
      }
    )
  }

  // If service accounts are defined then manage them
  if (execCommandResult.success && metadata?.serviceAccounts && Array.isArray(metadata?.serviceAccounts)) {
    const allowedServiceAccounts = metadata?.serviceAccounts

    // Get existing service accounts
    const serviceAccounts = execCommand<ExistingServiceAccounts>(
      buildCommand([
        `gcloud secrets get-iam-policy ${secretName}`,
        '--format=json',
        getCommandOptions(options)
      ]),
      {
        silent: true,
        asJSON: true
      }
    )

    let existingServiceAccounts = []
    if (serviceAccounts?.bindings) {
      existingServiceAccounts = serviceAccounts.bindings?.find(({ role }) => role === 'roles/secretmanager.secretAccessor')?.members ?? []
    }

    // Check what service accounts to delete
    const serviceAccountsToDelete = existingServiceAccounts.filter((account) => !allowedServiceAccounts.includes(account))
    // Check what service accounts to add
    const serviceAccountsToAdd = allowedServiceAccounts.filter((account) => !existingServiceAccounts.includes(account))

    if (serviceAccountsToAdd.length > 0) {
      logger.info(`Going to add "${serviceAccountsToAdd.join(',')}" to secret "${secretName}"`)

      serviceAccountsToAdd.forEach((newMember) => {
        execCommand(buildCommand([
          `gcloud secrets add-iam-policy-binding ${secretName}`,
          `--member='${newMember}'`,
          `--role='roles/secretmanager.secretAccessor'`,
          getCommandOptions(options)
        ]))
      })
    }

    if (serviceAccountsToDelete.length > 0) {
      logger.info(`Going to remove "${serviceAccountsToDelete.join(',')}" from secret "${secretName}"`)

      serviceAccountsToDelete.forEach((deleteMember) => {
        execCommand(buildCommand([
          `gcloud secrets remove-iam-policy-binding ${secretName}`,
          `--member='${deleteMember}'`,
          `--role='roles/secretmanager.secretAccessor'`,
          getCommandOptions(options)
        ]))
      })
    }
  }

  return execCommandResult.success
}
