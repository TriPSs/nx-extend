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
  return execPackageManagerCommand(
    buildCommand([
      'shadcn@latest add',
      (options.component ?? '').length === 0 ? '--all' : options.component,
      options.overwrite && '--overwrite'
    ]),
    {
      env: {
        ...process.env,
        TS_NODE_PROJECT: 'tsconfig.base.json'
      }
    }
  )
}

export default addExecutor
