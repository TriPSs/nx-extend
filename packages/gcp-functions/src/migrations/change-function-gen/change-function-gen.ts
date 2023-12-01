/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree, updateProjectConfiguration } from '@nx/devkit'
import { getProjects } from 'nx/src/generators/utils/project-configuration'

interface DeployOptions {
  gen?: 1 | 2
}

/**
 * Migrates all functions with @nx-extend/gcp-functions:deploy target to:
 * - Delete "gen": 2, as this is the new default
 * - Adds "gen": 1, to keep behavior as is
 */
export default function update(tree: Tree) {
  const projects = getProjects(tree)

  for (const [name, project] of projects) {
    const deployTarget = Object.keys(project.targets).find((target) => (
      project.targets[target].executor === '@nx-extend/gcp-functions:deploy'
    ))

    if (deployTarget) {
      const options = project.targets[deployTarget].options as DeployOptions

      if (options.gen && options.gen === 2) {
        delete options.gen
      } else {
        options.gen = 1
      }

      project.targets[deployTarget].options = options

      updateProjectConfiguration(tree, name, project)
    }
  }
}
