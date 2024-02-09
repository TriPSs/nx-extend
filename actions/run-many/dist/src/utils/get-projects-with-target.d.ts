import type { ProjectConfiguration } from 'nx/src/config/workspace-json-project-json';
export declare function getProjectsWithTarget(projects: Map<string, ProjectConfiguration>, runProjects: string[], target: string): string[];
