import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { buildCommand, execCommand } from '@nx-extend/core'

import { ExecutorSchema } from '../schema'

export async function runBuilder(
  options: ExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)

  return execCommand(buildCommand([
    'gcloud deployment-manager deployments create',
    context.target.project,
    `--config=${options.file}`,
    options.project ? `--project=${options.project}` : false
  ]), {
    cwd: `${context.workspaceRoot}/${projectMeta.root}`
  })
}

export default createBuilder(runBuilder)
