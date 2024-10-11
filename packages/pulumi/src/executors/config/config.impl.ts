import { ExecutorContext, workspaceRoot } from '@nx/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { join } from 'path'
import { which } from 'shelljs'

export interface PreviewOptions {
  stack?: string
  root?: string
  parent?: string
  showSecrets?: boolean
  action: string
  secret?: boolean
  path?: boolean
  name?: string
  value?: string
}

export default async function configExecutor(
  options: PreviewOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  if (!which('pulumi')) {
    throw new Error('pulumi is not installed!')
  }

  const { sourceRoot } = context.projectsConfigurations.projects[context.projectName]

  execSync(buildCommand([
    'PULUMI_EXPERIMENTAL=true',
    'pulumi config',
    options.action,
    options.showSecrets && `--show-secrets`,
    options.secret && `--secret`,
    options.path && `--path`,
    options.name && options.value && `"${options.name}" "${options.value}"`,
    options.stack && `--stack=${options.stack}`
  ]), {
    cwd: join(workspaceRoot, options.root ?? sourceRoot),
    stdio: 'inherit'
  })

  return { success: true }
}
