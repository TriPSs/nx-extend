import { ExecutorContext } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'

import { ExecutorSchema } from '../schema'

export async function createExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot } = context.workspace.projects[context.projectName]

  return execCommand(buildCommand([
    'gcloud deployment-manager deployments create',
    context.projectName,
    `--config=${options.file}`,

    options.project && `--project=${options.project}`
  ]), {
    cwd: sourceRoot
  })
}

export default createExecutor
