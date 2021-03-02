import { exec, ExecOptions } from 'child_process'

export interface Options extends ExecOptions {

  silent?: boolean

}

export async function execCommand(
  command,
  options: Options
): Promise<{ success: boolean, output?: string }> {
  const childProcess = exec(command, options)

  /**
   * Ensure the child process is killed when the parent exits
   */
  process.on('exit', () => childProcess.kill())

  return new Promise<{ success: boolean, output?: string }>((res) => {
    let output = ''

    childProcess.stdout.on('data', (data) => {
      output += data

      if (!options.silent) {
        process.stdout.write(data)
      }
    })

    childProcess.stderr.on('data', (err) => {
      process.stderr.write(err)
    })

    childProcess.on('close', (code) => {
      res({ success: code === 0, output })
    })
  })
}
