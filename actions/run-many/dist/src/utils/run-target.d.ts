import type { ProjectGraphProjectNode } from 'nx/src/config/project-graph';
export declare function runTarget(cwd: string, projects: Record<string, ProjectGraphProjectNode>, runProjects: string[], target: string, config?: string, parallel?: string, withSummary?: boolean): Promise<void>;
