import { runNxCommandAsync as _runNxCommandAsync } from '@nx/plugin/testing'

export async function runNxCommandAsync(command: string, options: { env?: object } = {}): Promise<void> {
  const { stdout, stderr } = await _runNxCommandAsync(command, {
    silenceError: true,
    env: {
      YARN_ENABLE_HARDENED_MODE: '0',
      ...options.env
    }
  })

  console.log(stdout)
  if (stderr) {
    console.error(stderr)

    throw new Error(stderr)
  }
}
