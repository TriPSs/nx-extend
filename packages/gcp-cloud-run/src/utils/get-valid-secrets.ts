import { logger } from '@nx/devkit'

export function getValidSecrets(
  secrets?: string | string[] | Record<string, string>
): string[] {
  if (!secrets) {
    return []
  }

  if (typeof secrets === 'string') {
    try {
      secrets = JSON.parse(secrets)
    } catch {
      throw new Error('Invalid JSON passed to secrets argument')
    }
  }

  if (!Array.isArray(secrets)) {
    secrets = Object.keys(secrets).map(
      (secret) => `${secret}=${secrets[secret]}`
    )
  }

  return secrets
    .map((secret) => {
      if (secret.includes('=') && secret.includes(':')) {
        return secret
      }

      logger.warn(
        `"${secret}" is not a valid secret! It should be in the following format "ENV_VAR_NAME=SECRET:VERSION"`
      )

      return false
    })
    .filter(Boolean) as string[]
}
