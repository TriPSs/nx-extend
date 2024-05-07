import { Tree, updateProjectConfiguration } from '@nx/devkit'
import { getProjects } from 'nx/src/generators/utils/project-configuration'

/**
 * Migrates all "add" targets with @nx-extend/shadcn-ui:add target to become "add-component"
 */
export default function update(tree: Tree) {
  const projects = getProjects(tree)

  for (const [name, project] of projects) {
    const addTarget = Object.keys(project.targets).find((target) => (
      project.targets[target].executor === '@nx-extend/shadcn-ui:add'
    ))

    if (addTarget && addTarget === 'add') {
      project.targets['add-component'] = project.targets[addTarget]
      delete project.targets[addTarget]

      updateProjectConfiguration(tree, name, project)
    }
  }
}
