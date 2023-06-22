import { ExecutorContext } from '@nx/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface ExecutorOptions {
  backendConfig: { key: string; name: string }[]
  autoApproval: boolean
  planFile: string
  ciMode: boolean

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
    const { backendConfig = [], planFile, ciMode, autoApproval } = options

    let env = {}
    if (ciMode) {
      env = {
        TF_IN_AUTOMATION: true,
        TF_INPUT: 0
      }
    }

    execSync(
      buildCommand([
        'terraform',
        command,
        ...backendConfig.map(
          (config) => `-backend-config="${config.key}=${config.name}"`
        ),
        command === 'plan' && planFile && `-out ${planFile}`,
        command === 'apply' && autoApproval && '-auto-approve',
        command === 'apply' && planFile
      ]),
      {
        cwd: sourceRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          ...env
        }
      }
    )

    return Promise.resolve({ success: true })
  }
}
