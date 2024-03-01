import { ExecutorContext, workspaceRoot } from '@nx/devkit'
import { buildCommand, USE_VERBOSE_LOGGING_MINIMAL } from '@nx-extend/core'
import { execSync } from 'child_process'
import { join } from 'path'
import { which } from 'shelljs'

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
      'pulumi up --suppress-progress',
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
