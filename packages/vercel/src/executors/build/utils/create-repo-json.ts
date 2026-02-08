import { readJsonFile, writeJsonFile } from '@nx/devkit'
import { existsSync } from 'node:fs'

/**
 * Creates a repo.json file if it doesn't exist yet'
 */
export function createRepoJson(orgId: string, projectId: string, projectName: string, projectRoot: string) {
  const repoJsonLocation = `.vercel/repo.json`

  let repoJson: {
    orgId: string
    remoteName: string
    projects: Array<{ id: string, name: string, directory: string }>
  }

  if (!existsSync(repoJsonLocation)) {
    repoJson = {
      orgId,
      remoteName: 'origin',
      projects: []
    }
  } else {
    repoJson = readJsonFile(repoJsonLocation)
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
