import { logger } from '@nx/devkit'

/**
 * The following flags apply to a single container.
 * If the '--container' flag is specified, these flags may only be specified after a --container flag.
 * Otherwise they will apply to the primary ingress container.
 */
export interface ContainerFlags {
  container?: string // Specifies a container by name. Flags following --container will apply to the specified container.
  args?: string // Comma-separated arguments passed to the command run by the container image.
  command?: string // Entrypoint for the container image.
  cpu?: string // CPU limit in Kubernetes cpu units.
  dependsOn?: string[] // List of container dependencies to add to the current container.
  memory?: string // Memory limit.
  port?: number | 'default' // Container port to receive requests at.
  http2?: boolean // "useHttp2" -> Whether to use HTTP/2 for connections to the service.
  clearEnvVars?: boolean // Remove all environment variables.
  envVarsFile?: string // Path to a local YAML file with definitions for all environment variables.
  envVars?: Record<string, string> // List of key-value pairs to set as environment variables.
  // updateEnvVars?: Record<string, string> // List of key-value pairs to set as environment variables.
  // removeEnvVars?: string[] // List of environment variables to be removed.
  secrets?: string[]
  // updateSecrets?: Record<string, string> // List of key-value pairs to set as secrets.
  // removeSecrets?: string[] // List of secrets to be removed.
  // clearSecrets?: boolean // Remove all secrets.
  image?: string // Name of the container image to deploy.
  source?: string // The location of the source to build.
  // clearLabels?: boolean // Remove all labels.
  // removeLabels?: string[] // List of label keys to remove.
  labels?: string[] // List of label KEY=VALUE pairs to add.
  // updateLabels?: Record<string, string> // List of label KEY=VALUE pairs to update.
  volumeMount?: string // VOLUME_NAME,mount-path=MOUNT_PATH
}

export function getContainerFlags(options: ContainerFlags, containerRequired: boolean): string[] {
  if (containerRequired && !options.container) {
    throw new Error('Option "container" is not set! This is required when using sidecars.')
  }

  const setEnvVars = Object.keys(options.envVars || {}).reduce((env, envVar) => {
    env.push(`${envVar}=${options.envVars[envVar]}`)

    return env
  }, [])

  const validSecrets = (options.secrets || []).map((secret) => {
    if (secret.includes('=') && secret.includes(':')) {
      return secret
    }

    logger.warn(`"${secret}" is not a valid secret! It should be in the following formats: "ENV_VAR_NAME=SECRET:VERSION" or "/secrets/api/key=SECRET:VERSION"`)
    return false
  })
    .filter(Boolean)

  return [
    options.container && `--container=${options.container}`,
    options.image && `--image=${options.image}`,
    !options.image && `--source=${options.source || './'}`, // fallback to current (dist) directory
    options.args && `--args=${options.args}`,
    options.command && `--command=${options.command}`,
    options.cpu && `--cpu=${options.cpu}`,
    options.dependsOn && `--depends-on=${options.dependsOn}`,

    `--memory=${options.memory || '128Mi'}`,

    options.port && `--port=${options.port}`,
    options.http2 ? '--use-http2' : '--use-no-http2',
    options.clearEnvVars && `--clear-env-vars=${options.clearEnvVars}`,
    options.envVarsFile && `--env-vars-file=${options.envVarsFile}`,
    setEnvVars && `--set-env-vars=${setEnvVars.join(',')}`,
    // options.updateEnvVars && `--update-env-vars=${options.updateEnvVars}`,
    // options.removeEnvVars && `--remove-env-vars=${options.removeEnvVars}`,
    validSecrets.length > 0 && `--set-secrets=${validSecrets.join(',')}`,
    // options.updateSecrets && `--update-secrets=${options.updateSecrets}`,
    // options.removeSecrets && `--remove-secrets=${options.removeSecrets}`,
    // options.clearSecrets && `--clear-secrets=${options.clearSecrets}`,
    // options.clearLabels && `--clear-labels=${options.clearLabels}`,
    // options.removeLabels && `--remove-labels=${options.removeLabels}`,
    options.labels && `--clear-labels --labels=${options.labels.join(',')}`,
    // options.updateLabels && `--update-labels=${options.updateLabels}`,
    options.volumeMount && `--add-volume-mount=volume=${options.volumeMount}`,
  ]
}
