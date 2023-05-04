import { ExecutorContext } from '@nx/devkit'

export const getProjectRoot = (context: ExecutorContext): string => {
  return context.workspace.projects[context.projectName].root
}
