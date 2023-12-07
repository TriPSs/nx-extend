import { buildCommand, USE_VERBOSE_LOGGING_MINIMAL } from '@nx-extend/core'
import { ExecutorContext, workspaceRoot } from '@nx/devkit'
import { execSync } from 'child_process'
import { which } from 'shelljs'
import { join } from 'path'

export interface UpOptions {
  stack?: string,
  skipPreview?: boolean
  yes?: boolean
  suppressOutputs?: boolean
  json?: boolean
  root?: string
}

export default async function createExecutor(
  options: UpOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  if (!which('pulumi')) {
    throw new Error('pulumi is not installed!')
  }

  const { sourceRoot } = context.workspace.projects[context.projectName]

  execSync(
    buildCommand([
      'pulumi up',
      options.stack && `--stack=${options.stack}`,
      options.skipPreview && '--skip-preview',
      options.yes && '--yes',
      options.suppressOutputs && '--suppress-outputs',
      USE_VERBOSE_LOGGING_MINIMAL && '--debug',
      options.json && '--json'
    ]),
    {
      cwd: join(workspaceRoot, options.root ?? sourceRoot),
      stdio: 'inherit'
    }
  )

  return Promise.resolve({ success: true })
}
