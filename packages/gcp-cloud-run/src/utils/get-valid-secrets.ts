import { logger } from '@nx/devkit'

export function getValidSecrets(secrets?: string[] | Record<string, string>): string[] {
  if (!secrets) {
    return []
  }

  if (!Array.isArray(secrets)) {
    secrets = Object.values(secrets).map((secret) => `${secret}=${secrets[secret]}`)
  }

  return secrets.map((secret) => {
    if (secret.includes('=') && secret.includes(':')) {
      return secret
    }

    logger.warn(`"${secret}" is not a valid secret! It should be in the following format "ENV_VAR_NAME=SECRET:VERSION"`)

    return false
  }).filter(Boolean) as string[]
}
