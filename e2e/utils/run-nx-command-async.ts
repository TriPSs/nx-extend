import { tmpProjPath } from '@nx/plugin/testing'
import { execSync } from 'child_process'

export async function runNxCommandAsync(command: string, options: { env?: object } = {}): Promise<void> {
  execSync(`yarn nx ${command}`, {
    cwd: tmpProjPath(),
    stdio: 'inherit',
    env: {
      // CI: 'true',
      YARN_ENABLE_HARDENED_MODE: '0',
      ...options.env
    }
  })
}
