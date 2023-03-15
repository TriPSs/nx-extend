import { ExecutorContext } from '@nrwl/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface ExecutorOptions {
  backendConfig: { key: string, name: string }[]

  [key: string]: string | unknown
}

export function createExecutor(command: string) {
  return async function runExecutor(
    options: ExecutorOptions,
    context: ExecutorContext
  ): Promise<{ success: boolean }> {
    if (!which('terraform')) {
      throw new Error('Terraform is not installed!')
    }

    const { sourceRoot } = context.workspace.projects[context.projectName]
    const { backendConfig = [] } = options

    execSync(buildCommand([
      'terraform',
      command,
      ...backendConfig.map((config) => `-backend-config="${config.key}=${config.name}"`)
    ]), {
      cwd: sourceRoot,
      stdio: 'inherit'
    })

    return Promise.resolve({ success: true })
  }
}
