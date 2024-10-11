import { ExecutorContext } from '@nx/devkit'

export const getProjectRoot = (context: ExecutorContext): string => {
  return context.projectsConfigurations.projects[context.projectName].root
}
