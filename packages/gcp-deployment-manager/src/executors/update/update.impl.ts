import { createBuilder, BuilderContext } from '@angular-devkit/architect';
import { execCommand } from '@nx-extend/core';

import { ExecutorSchema } from '../schema';

export async function runBuilder(
  options: ExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project);

  const command = [
    'gcloud deployment-manager deployments update',
    context.target.project,
    `--config=${options.file}`,
    options.project ? `--project=${options.project}` : false,
  ].filter(Boolean);

  return execCommand(command.join(' '), {
    cwd: `${context.workspaceRoot}/${projectMeta.root}`,
  });
}

export default createBuilder(runBuilder);
