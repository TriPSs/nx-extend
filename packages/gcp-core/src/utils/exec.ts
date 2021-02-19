import { exec, ExecOptions } from 'child_process'

export async function execCommand(
  command,
  options: ExecOptions = {}
): Promise<{ success: boolean }> {
  const childProcess = exec(command, options)

  /**
   * Ensure the child process is killed when the parent exits
   */
  process.on('exit', () => childProcess.kill())

  return new Promise<{ success: boolean }>((res) => {
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data)
    })

    childProcess.stderr.on('data', (err) => {
      process.stderr.write(err)
    })

    childProcess.on('close', (code) => {
      res({ success: code === 0 })
    })
  })
}
