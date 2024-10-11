import { ExecutorContext, workspaceRoot } from '@nx/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { join } from 'path'
import { which } from 'shelljs'

export interface PreviewOptions {
  stack?: string
  root?: string
  target: string
  name: string
  id: string
  parent?: string
}

export default async function creatExecutor(
  options: PreviewOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  if (!which('pulumi')) {
    throw new Error('pulumi is not installed!')
  }

  const { sourceRoot } = context.projectsConfigurations.projects[context.projectName]

  execSync(buildCommand([
    'PULUMI_EXPERIMENTAL=true',
    'pulumi import',
    options.target,
    options.name,
    options.id,
    options.parent && `--parent 'parent=${options.parent}'`,
    options.stack && `--stack=${options.stack}`
  ]), {
    cwd: join(workspaceRoot, options.root ?? sourceRoot),
    stdio: 'inherit'
  })

  return { success: true }
}
