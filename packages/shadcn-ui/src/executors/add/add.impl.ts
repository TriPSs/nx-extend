import { ExecutorContext } from '@nx/devkit'
import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'

export interface ExecutorSchema {
  component: string
  overwrite?: boolean
}

export async function addExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.workspace.projects[context.projectName]

  return execPackageManagerCommand(buildCommand([
    'shadcn-ui@latest add',
    options.component,
    options.overwrite && '--overwrite',
    '--path=src',
    `--cwd=${root}`
  ]),{

  })
}

export default addExecutor
