import * as shell from 'shelljs'
import { ShellString, ExecOptions } from 'shelljs'
import { ChildProcess } from 'child_process'

export interface Options extends ExecOptions {

  asString?: boolean
  asJSON?: boolean

}

export {
  ShellString,
  ChildProcess
}

export type Result<Output> = Output extends string
  ? string
  : Output

export const execCommand = <Output = { success: boolean, output: string }>(
  command,
  options: Options = {
    asString: false,
    asJSON: false
  }
): Output => {
  const result = shell.exec(command, options)

  if (options.asJSON) {
    return JSON.parse(result.toString())
  }

  if (options.asString) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return result.toString()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {
    success: result['code'] === 0,
    output: result.stdout
  }
}
