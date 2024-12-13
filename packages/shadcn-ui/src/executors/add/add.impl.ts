import { workspaceRoot } from '@nx/devkit'
import { buildCommand, getPackageManagerDlxCommand } from '@nx-extend/core'
import { execSync } from 'child_process'

export interface ExecutorSchema {
  component?: string
  overwrite?: boolean
}

export async function addExecutor(options: ExecutorSchema): Promise<{ success: boolean }> {
  execSync(buildCommand([
    getPackageManagerDlxCommand(),
    'shadcn@latest add',
    (options.component ?? '').length === 0 ? '--all' : options.component,
    options.overwrite && '--overwrite'
  ]), {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      TS_NODE_PROJECT: 'tsconfig.base.json'
    },
    stdio: 'inherit'
  })

  return { success: true }
}

export default addExecutor
