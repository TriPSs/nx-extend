import { join } from 'path'
import { BuilderContext } from '@angular-devkit/architect'

export const getProjectRoot = async (context: BuilderContext): Promise<string> => {
  const projectMetadata = await context.getProjectMetadata(context.target.project)

  return join(`${context.workspaceRoot}`, `${projectMetadata.root}`)
}
