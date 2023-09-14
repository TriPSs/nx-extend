import { ExecutorContext } from '@nx/devkit'
import { buildCommand, USE_VERBOSE_LOGGING_MINIMAL } from '@nx-extend/core'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface UpOptions {
  stack?: string,
  skipPreview?: boolean
  yes?: boolean
  suppressOutputs?: boolean
  json?: boolean
}

export default async function creatExecutor(
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
      cwd: sourceRoot,
      stdio: 'inherit'
    }
  )

  return Promise.resolve({ success: true })
}
