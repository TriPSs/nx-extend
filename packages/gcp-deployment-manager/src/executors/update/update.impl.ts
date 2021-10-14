import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { buildCommand, execCommand } from '@nx-extend/core'

import { ExecutorSchema } from '../schema'

export interface Options extends ExecutorSchema {

  deletePolicy?: string

  createPolicy?: string

}

export async function runBuilder(
  options: Options,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)

  return execCommand(buildCommand([
    'gcloud deployment-manager deployments update',
    context.target.project,
    `--config=${options.file}`,
    options.project ? `--project=${options.project}` : false,
    options.createPolicy ? `--delete-policy=${options.deletePolicy}` : false,
    options.deletePolicy ? `--delete-policy=${options.deletePolicy}` : false
  ]), {
    cwd: `${context.workspaceRoot}/${projectMeta.root}`
  })
}

export default createBuilder(runBuilder)
