import { tmpProjPath } from '@nx/plugin/testing'
import { execSync } from 'child_process'

function getStrippedEnvironmentVariables() {
  return Object.fromEntries(
    Object.entries(process.env).filter(([key, value]) => {
      if (key.startsWith('NX_E2E_')) {
        return true
      }

      const allowedKeys = ['NX_PCV3']

      if (key.startsWith('NX_') && !allowedKeys.includes(key)) {
        return false
      }

      return ['JEST_WORKER_ID', 'CI'].includes(key)
    })
  )
}

export async function runNxCommandAsync(command: string, options: { env?: object } = {}): Promise<void> {
  execSync(`npx nx ${command}`, {
    cwd: tmpProjPath(),
    stdio: 'inherit',
    env: {
      ...getStrippedEnvironmentVariables(),
      YARN_ENABLE_HARDENED_MODE: '0',
      ...options.env
    }
  })
}
