import { buildCommand } from '@nx-extend/core'
import { ExecutorContext } from '@nx/devkit'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface RefreshOptions {
  stack?: string,
  skipPreview?: boolean,
  yes?: boolean,
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
      cwd: sourceRoot,
      stdio: 'inherit'
    }
  )

  return Promise.resolve({ success: true })
}
