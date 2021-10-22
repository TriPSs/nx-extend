import { createBuilder, BuilderContext } from '@angular-devkit/architect'
import { buildCommand, execCommand } from '@nx-extend/core'

import { ExecutorSchema } from '../schema'

export async function runBuilder(
  options: ExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)
  const projectSourceRoot = `${context.workspaceRoot}/${projectMeta.sourceRoot}`

  return execCommand(buildCommand([
    'gcloud deployment-manager deployments create',
    context.target.project,
    `--config=${options.file}`,
    options.project ? `--project=${options.project}` : false
  ]), {
    cwd: projectSourceRoot
  })
}

export default createBuilder(runBuilder)
