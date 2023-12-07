import { ExecutorContext } from '@nx/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface PreviewOptions {
  stack?: string
  cwd?: string
}

export default async function creatExecutor(
  options: PreviewOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  if (!which('pulumi')) {
    throw new Error('pulumi is not installed!')
  }

  const { sourceRoot } = context.workspace.projects[context.projectName]

  execSync(
    buildCommand([
      'PULUMI_EXPERIMENTAL=true',
      'pulumi preview --diff',
      options.stack && `--stack=${options.stack}`
    ]),
    {
      cwd: options.cwd ?? sourceRoot,
      stdio: 'inherit'
    }
  )

  return Promise.resolve({ success: true })
}
