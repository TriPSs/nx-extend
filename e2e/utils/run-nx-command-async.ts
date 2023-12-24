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

      return key !== 'JEST_WORKER_ID'
    })
  )
}

export async function runNxCommandAsync(command: string): Promise<void> {
  execSync(`yarn nx ${command}`, {
    cwd: tmpProjPath(),
    stdio: 'inherit',
    env: {
      // CI: 'true',
      YARN_ENABLE_HARDENED_MODE: '0',
      ...getStrippedEnvironmentVariables()
    }
  })
}
