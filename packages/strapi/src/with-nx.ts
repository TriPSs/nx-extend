import { parseTargetString, readCachedProjectGraph, workspaceRoot } from '@nx/devkit'
import path from 'node:path'

export function withNx(config: any, webpack: any) {
  const nxProject = process.env.NX_TASK_TARGET_PROJECT

  if (!nxProject) {
    throw new Error('Not running with NX?')
  }
  const projectGraph = readCachedProjectGraph()
  const projectNode = projectGraph.nodes[nxProject]

  if (!projectNode) {
    throw new Error(`Project "${nxProject}" not found!`)
  }

  const project = projectNode.data
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
      outputPath = projectGraph.nodes[buildTarget.project].data.targets[buildTarget.target].options.outputPath
    }

    if (!outputPath) {
      throw new Error('No "outputPath" option found!')
    }

    const root = options.root || project.root

    // Sanity safety check
    if (config?.entry?.main && Array.isArray(config.entry.main)) {
      config.entry.main = config.entry.main.map((entry) => (
        path.resolve(workspaceRoot, root, entry)
      ))
    }

    // Overwrite the output path to be the one defined in project options
    if (config?.output?.path) {
      config.output.path = path.resolve(workspaceRoot, outputPath, 'build')
    }
  }

  return config
}
