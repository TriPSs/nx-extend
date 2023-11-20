import { parseTargetString, workspaceRoot } from '@nx/devkit'
import { readCachedProjectGraph } from '@nx/workspace/src/core/project-graph'
import { FsTree } from 'nx/src/generators/tree'
import { getProjects } from 'nx/src/generators/utils/project-configuration'

export function withNx(config: any, webpack: any) {
  const nxTree = new FsTree(workspaceRoot, false)
  const projects = getProjects(nxTree)

  const project = projects.get(process.env.NX_TASK_TARGET_PROJECT)

  if (!project) {
    throw new Error('Project not found!')
  }

  const target = project.targets[process.env.NX_TASK_TARGET_TARGET]

  const isServing = target.executor === '@nx-extend/strapi:serve'

  // We don't want to any of the below things when we are serving
  if (!isServing) {
    let options = target.options
    if (process.env.NX_TASK_TARGET_CONFIGURATION && process.env.NX_TASK_TARGET_CONFIGURATION in target.configurations[process.env.NX_TASK_TARGET_CONFIGURATION]) {
      options = {
        ...options,
        ...target.configurations[process.env.NX_TASK_TARGET_CONFIGURATION]
      }
    }

    let outputPath = options.outputPath

    if (!outputPath && options.buildTarget) {
      const buildTarget = parseTargetString(options.buildTarget, readCachedProjectGraph())
      outputPath = projects.get(buildTarget.project).targets[buildTarget.target].options.outputPath
    }

    if (!outputPath) {
      throw new Error('No "outputPath" option found!')
    }

    const root = options.root || project.root

    config.entry.main = [workspaceRoot + `/${root}/.strapi/client/app.js`]
    config.output.path = workspaceRoot + `/${outputPath}/build`
  }

  return config
}
