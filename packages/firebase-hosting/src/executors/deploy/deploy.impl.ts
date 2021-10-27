// import { ExecutorContext } from '@nrwl/devkit'
import { execCommand, buildCommand } from '@nx-extend/core'

export interface ExecutorSchema {

  site: string

}

export function deployExecutor(
  options: ExecutorSchema,
  // context: ExecutorContext
): Promise<{ success: boolean }> {
  // Make sure the deployment target is defined
  execCommand(buildCommand([
    'npx firebase target:apply',
    `hosting ${options.site} ${options.site}`
  ]))

  return execCommand(buildCommand([
    'npx firebase deploy',
    `--only=hosting:${options.site}`
  ]))
}

export default deployExecutor
