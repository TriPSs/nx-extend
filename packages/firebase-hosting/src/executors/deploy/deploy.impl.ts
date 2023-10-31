import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'

export interface ExecutorSchema {
  site: string
  identifier?: string
  project?: string
  message?: string
}

export function deployExecutor(
  options: ExecutorSchema
  // context: ExecutorContext
): Promise<{ success: boolean }> {
  // Make sure the deployment target is defined
  execPackageManagerCommand(buildCommand([
    'firebase target:apply',
    `hosting ${options.site} ${options.identifier || options.site}`,

    options.project && `--project=${options.project}`
  ]))

  return Promise.resolve(execPackageManagerCommand(buildCommand([
      'firebase deploy',
      `--only=hosting:${options.site}`,

      options.project && `--project=${options.project}`,
      options.message && `-m "${options.message}"`
    ])
  ))
}

export default deployExecutor
