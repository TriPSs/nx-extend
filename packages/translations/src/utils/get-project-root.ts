import { ExecutorContext } from '@nrwl/devkit'

export const getProjectRoot = (context: ExecutorContext): string => {
  return context.workspace.projects[context.projectName].root
}
