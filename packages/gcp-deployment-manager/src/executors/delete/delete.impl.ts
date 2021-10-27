import { ExecutorContext } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'

import { ExecutorSchema } from '../schema'

export async function deleteExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot } = context.workspace.projects[context.projectName]

  return execCommand(buildCommand([
    'gcloud deployment-manager deployments delete',
    context.projectName,
    '-q',

    options.project && `--project=${options.project}`
  ]), {
    cwd: sourceRoot
  })
}

export default deleteExecutor
