import { BuilderContext, createBuilder } from '@angular-devkit/architect'

import { BuildExecutorSchema } from './schema'
import { execCommand } from '../../utils/exec'

export async function runBuilder(
  options: BuildExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)

  return execCommand('npx strapi develop', {
    cwd: `${context.workspaceRoot}/${projectMeta.root}`
  })
}

export default createBuilder(runBuilder)
