import { runNxCommandAsync as _runNxCommandAsync } from '@nx/plugin/testing'

export function runNxCommandAsync(command: string) {
  return _runNxCommandAsync(command, {
    env: {
      YARN_ENABLE_HARDENED_MODE: '0'
    }
  })
}
