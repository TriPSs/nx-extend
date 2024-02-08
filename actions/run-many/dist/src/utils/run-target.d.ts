import type { ProjectConfiguration } from 'nx/src/config/workspace-json-project-json';
export declare function runTarget(cwd: string, projects: Map<string, ProjectConfiguration>, runProjects: string[], target: string, config?: string, parallel?: string, withSummary?: boolean): Promise<void>;
