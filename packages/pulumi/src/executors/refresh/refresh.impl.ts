import { ExecutorContext, workspaceRoot } from '@nx/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { join } from 'path'
import { which } from 'shelljs'

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
      'pulumi refresh --suppress-progress',
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
