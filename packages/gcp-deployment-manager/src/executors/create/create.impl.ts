import { ExecutorContext } from '@nx/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'

import { ExecutorSchema } from '../schema'

export async function createExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot } = context.projectsConfigurations.projects[context.projectName]

  return Promise.resolve(
    execCommand(
      buildCommand([
        'gcloud deployment-manager deployments create',
        options.name || context.projectName,
        `--config=${options.file}`,

        options.project && `--project=${options.project}`,
        options.preview && `--preview`
      ]),
      {
        cwd: sourceRoot
      }
    )
  )
}

export default createExecutor
