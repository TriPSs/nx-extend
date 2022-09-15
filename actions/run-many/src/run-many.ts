import * as core from '@actions/core'
import { getProjects, logger, workspaceRoot } from '@nrwl/devkit'
import { FsTree } from 'nx/src/generators/tree'

import { buildCommand } from './utils/build-command'
import { execCommand } from './utils/exec'
import { runTarget } from './utils/run-target'

async function run() {
  try {
    const nxTree = new FsTree(workspaceRoot, false)
    const projects = getProjects(nxTree)

    // Get all options
    const tag = core.getInput('tag')
    const target = core.getInput('target', { required: true })
    const affectedTarget = core.getInput('affectedTarget')
    const jobIndex = parseInt(core.getInput('index') || '1', 10)
    const jobCount = parseInt(core.getInput('count') || '1', 10)
    const parallel = core.getInput('parallel')
    const preTargets = core.getMultilineInput('preTargets', { trimWhitespace: true })
    const postTargets = core.getMultilineInput('postTargets', { trimWhitespace: true })

    core.info(`preTargets ${JSON.stringify(preTargets)}`)
    core.info(`postTargets ${JSON.stringify(postTargets)}`)

    if (tag) {
      core.info(`Running all projects with tag "${tag}"`)
    }

    // Get all affected projects
    const { projects: affectedProjects } = execCommand<{ projects: any }>(buildCommand([
      'npx nx print-affected',
      `--target=${affectedTarget || target}`
    ]), {
      asJSON: true,
      silent: !core.isDebug()
    })

    // Filter out all projects that are not allowed
    const allowedProjects = [...projects].filter(([_, config]) => {
      // Check if the project has the ci=off tag
      const hasCiOffTag = (config?.tags ?? []).includes('ci=off')

      // If the project does not have the target or is disabled by ci=pff don't run it
      if (hasCiOffTag) {
        return false
      }

      // If a tag is provided the project should have it
      return !tag || (config?.tags ?? []).includes(tag)
    }).map(([target]) => target)

    const projectsToRun = affectedProjects.filter((project) => {
      return allowedProjects.includes(project)
    })

    const sliceSize = Math.max(Math.floor(projectsToRun.length / jobCount), 1)
    const runProjects = jobIndex < jobCount
      ? projectsToRun.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
      : projectsToRun.slice(sliceSize * (jobIndex - 1))

    if (preTargets.length > 0) {
      for (const target of preTargets) {
        logger.info(`Running preTarget "${target}"`)
        await runTarget(projects, runProjects, target, parallel)
      }
    }

    await runTarget(projects, runProjects, target, parallel, true)

    if (postTargets.length > 0) {
      for (const target of postTargets) {
        logger.info(`Running postTarget "${target}"`)
        await runTarget(projects, runProjects, target, parallel)
      }
    }
  } catch (err) {
    core.setFailed(err)
  }
}

run()
