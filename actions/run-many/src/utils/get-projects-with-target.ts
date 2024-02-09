import type { ProjectGraphProjectNode } from 'nx/src/config/project-graph'

export function getProjectsWithTarget(projects: Record<string, ProjectGraphProjectNode>, runProjects: string[], target: string): string[] {
  // Filter out all projects that are not allowed
  return Object.keys(projects).filter((project) => {
    // Check if the project has the provided target
    return Object.keys(projects[project].data?.targets ?? {}).includes(target)
      && runProjects.includes(project)
  }).map((project) => project)
}
