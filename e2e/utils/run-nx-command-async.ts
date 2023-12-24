import { runNxCommandAsync as _runNxCommandAsync } from '@nx/plugin/testing'

export async function runNxCommandAsync(command: string, options: { env?: object } = {}): Promise<void> {
  const { stdout, stderr } = await _runNxCommandAsync(`${command} --verbose`, {
    silenceError: true,
    env: {
      CI: 'true',
      YARN_ENABLE_HARDENED_MODE: '0',
      YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
      ...options.env
    }
  })

  console.log(stdout)
  if (stderr) {
    console.log(stderr)
  }
}
