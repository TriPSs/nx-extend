import { readJsonFile, writeJsonFile } from '@nx/devkit'

/**
 * Creates a repo.json file if it doesn't exist yet'
 */
export function createRepoJson(orgId: string, projectId: string, projectName: string, projectRoot: string) {
  const repoJsonLocation = `.vercel/repo.json`

  let repoJson = readJsonFile(repoJsonLocation)
  if (!repoJson) {
    repoJson = {
      orgId,
      remoteName: 'origin',
      projects: []
    }
  }

  if (!repoJson.projects.some((project) => project.id === projectId)) {
    repoJson.projects.push({
      id: projectId,
      name: projectName,
      directory: projectRoot
    })

    writeJsonFile(repoJsonLocation, repoJson)
  }
}
