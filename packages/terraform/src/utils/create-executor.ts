import { ExecutorContext } from '@nrwl/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface ExecutorOptions {
  [key: string]: string|[];
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
    const optionsToString = options.backendConfig.length ? options?.backendConfig?.map((x) => `-backend-config="${x.key}=${x.name}"`).join(" ") : ''

    const buildedCommand = ['terraform', command, optionsToString ]

    execSync(buildCommand(buildedCommand), {
      cwd: sourceRoot,
      stdio: 'inherit'
    })

    return Promise.resolve({ success: true })
  }
}
