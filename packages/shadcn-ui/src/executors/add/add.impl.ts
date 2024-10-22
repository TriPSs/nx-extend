import { ExecutorContext } from '@nx/devkit'
import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'

export interface ExecutorSchema {
  component?: string
  overwrite?: boolean
}

export async function addExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.projectsConfigurations.projects[context.projectName]

  return execPackageManagerCommand(
    buildCommand([
      'shadcn-ui@0.8.0 add',
      (options.component ?? '').length === 0 ? '--all' : options.component,
      options.overwrite && '--overwrite',
      '--path=src',
      `--cwd=${root}`
    ]),
    {}
  )
}

export default addExecutor
