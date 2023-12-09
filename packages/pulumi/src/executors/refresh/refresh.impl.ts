import { buildCommand } from '@nx-extend/core'
import { ExecutorContext, workspaceRoot } from '@nx/devkit'
import { execSync } from 'child_process'
import { which } from 'shelljs'
import { join } from 'path'

export interface RefreshOptions {
  stack?: string,
  skipPreview?: boolean,
  yes?: boolean,
  root?: string,
}

export default async function createExecutor(
  options: RefreshOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  if (!which('pulumi')) {
    throw new Error('pulumi is not installed!')
  }

  const { sourceRoot } = context.workspace.projects[context.projectName]

  execSync(
    buildCommand([
      'PULUMI_EXPERIMENTAL=true',
      'pulumi refresh',
      options.stack && `--stack=${options.stack}`,
      options.skipPreview && '--skip-preview',
      options.yes && '--yes'
    ]),
    {
      cwd: join(workspaceRoot, options.root ?? sourceRoot),
      stdio: 'inherit'
    }
  )

  return Promise.resolve({ success: true })
}
