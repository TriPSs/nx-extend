import * as core from '@actions/core'
import { getProjects, logger, workspaceRoot } from '@nrwl/devkit'
import { FsTree } from 'nx/src/generators/tree'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

const argv = yargs(hideBin(process.argv))
  .options({
    tag: { type: 'string' },
    target: { type: 'string' },
    parallel: { type: 'number' },
    includeLibs: { type: 'boolean' }
  })
  .parseSync()

import { buildCommand } from './utils/build-command'
import { execCommand } from './utils/exec'
import { runTarget } from './utils/run-target'

async function run() {
  try {
    const nxTree = new FsTree(workspaceRoot, false)
    const projects = getProjects(nxTree)

    // Get all options
    const tag = core.getInput('tag') || argv.tag
    const target = core.getInput('target', { required: !argv.target }) || argv.target
    const jobIndex = parseInt(core.getInput('index') || '1', 10)
    const jobCount = parseInt(core.getInput('count') || '1', 10)
    const parallel = (core.getInput('parallel') || argv.parallel) as string
    const preTargets = core.getMultilineInput('preTargets', { trimWhitespace: true })
    const postTargets = core.getMultilineInput('postTargets', { trimWhitespace: true })
    // const includeLibs = Boolean(core.getInput('includeLibs')) || argv.includeLibs

    core.debug(`Job index ${jobIndex}`)
    core.debug(`Job count ${jobCount}`)

    core.debug(`Pre targets ${JSON.stringify(preTargets, null, 2)}`)
    core.debug(`Post targets ${JSON.stringify(postTargets, null, 2)}`)

    if (tag) {
      core.info(`Running all projects with tag "${tag}"`)
    }

    let affectedProjects = []
    // Get all affected projects
    const { projects: affectedApps } = execCommand<{ projects: any }>(buildCommand([
      'npx nx print-affected',
      `--target=${target}`,
      '--type=app'
    ]), {
      asJSON: true,
      silent: !core.isDebug()
    })

    affectedProjects = affectedProjects.concat(affectedApps)

    // if (includeLibs) {
    //   core.info('Going to include all the libs')
    //
    //   const { projects: affectedLibs } = execCommand<{ projects: any }>(buildCommand([
    //     'npx nx print-affected',
    //     `--target=${target}`,
    //     '--type=lib'
    //   ]), {
    //     asJSON: true,
    //     silent: !core.isDebug()
    //   })
    //
    //   affectedProjects = affectedProjects.concat(affectedLibs)
    // }

    // Filter out all projects that are not allowed
    const allowedProjects = Array.from(projects).filter(([project, config]) => {
      // Check if the project has the ci=off tag
      const hasCiOffTag = (config?.tags ?? []).includes('ci=off')
      // Check if the project has the provided target
      const hasTarget = Object.keys(config?.targets ?? {}).includes(target)

      // If the is disabled by ci=pff don't run it
      if (hasCiOffTag || !hasTarget) {
        if (hasCiOffTag) {
          core.debug(`[${project}]: Has the "ci=off" tag, skipping it.`)
        } else {
          core.debug(`[${project}]: Does not have the target "${target}", skipping it.`)
        }

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
