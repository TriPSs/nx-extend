import { ExecutorContext } from '@nx/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface UpOptions {
  stack?: string,
  skipPreview?: boolean,
  yes?: boolean
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
      options.yes && '--yes'
    ]),
    {
      cwd: sourceRoot,
      stdio: 'inherit'
    }
  )

  return Promise.resolve({ success: true })
}
