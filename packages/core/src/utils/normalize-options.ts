import { getWorkspaceLayout, joinPathFragments, names, Tree } from '@nrwl/devkit'

export interface DefaultGeneratorOptions {
  name: string
  directory?: string
  tags?: string
}

export interface NormalizedSchema extends DefaultGeneratorOptions {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}

export const normalizeOptions = (host: Tree, options: DefaultGeneratorOptions): NormalizedSchema => {
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName

  const projectRoot = joinPathFragments(getWorkspaceLayout(host).appsDir, projectDirectory)

  return {
    ...options,
    projectName: projectDirectory.replace(new RegExp('/', 'g'), '-'),
    projectRoot,
    projectDirectory,
    parsedTags: options?.tags?.split(',').map((s) => s.trim()) ?? []
  }
}
