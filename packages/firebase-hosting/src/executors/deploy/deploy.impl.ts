import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'

export interface ExecutorSchema {
  site: string
  identifier?: string
  project?: string
  message?: string

  cliVersion?: string
}

export async function deployExecutor(
  options: ExecutorSchema
  // context: ExecutorContext
): Promise<{ success: boolean }> {
  let cliCommand = 'firebase-tools'
  if (options.cliVersion) {
    cliCommand = `firebase-tools@${options.cliVersion}`
  }

  // Make sure the deployment target is defined
  execPackageManagerCommand(buildCommand([
    `${cliCommand} target:apply`,
    `hosting ${options.site} ${options.identifier || options.site}`,

    options.project && `--project=${options.project}`
  ]))

  return execPackageManagerCommand(buildCommand([
    `${cliCommand} deploy`,
    `--only=hosting:${options.site}`,

    options.project && `--project=${options.project}`,
    options.message && `-m "${options.message}"`
  ]))
}

export default deployExecutor
