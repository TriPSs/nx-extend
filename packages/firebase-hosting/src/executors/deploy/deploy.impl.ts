// import { ExecutorContext } from '@nx/devkit'
import { buildCommand,execCommand } from '@nx-extend/core'

export interface ExecutorSchema {
  site: string
  project?: string
}

export function deployExecutor(
  options: ExecutorSchema
  // context: ExecutorContext
): Promise<{ success: boolean }> {
  // Make sure the deployment target is defined
  execCommand(
    buildCommand([
      'npx firebase target:apply',
      `hosting ${options.site} ${options.site}`,

      options.project && `--project=${options.project}`
    ])
  )

  return Promise.resolve(
    execCommand(
      buildCommand([
        'npx firebase deploy',
        `--only=hosting:${options.site}`,

        options.project && `--project=${options.project}`
      ])
    )
  )
}

export default deployExecutor
