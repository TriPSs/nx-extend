import { ExecutorContext } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import { which } from 'shelljs'

export interface ExecutorOptions {
  [key: string]: string
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

    return Promise.resolve(execCommand(buildCommand([
      'terraform',
      command
    ]), {
      cwd: sourceRoot
    }))
  }
}
