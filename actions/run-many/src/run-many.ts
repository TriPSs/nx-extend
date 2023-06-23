import * as core from '@actions/core'
import { logger, workspaceRoot } from '@nx/devkit'
import { FsTree } from 'nx/src/generators/tree'
import { getProjects } from 'nx/src/generators/utils/project-configuration'
import { resolve } from 'path'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { buildCommand } from './utils/build-command'
import { execCommand } from './utils/exec'
import { runTarget } from './utils/run-target'

export const argv = yargs(hideBin(process.argv))
  .options({
    tag: { type: 'string' },
    config: { type: 'string' },
    target: { type: 'string' },
    parallel: { type: 'number' },
    verbose: { type: 'boolean' }
  })
  .parseSync()

async function run() {
  try {
    const nxTree = new FsTree(workspaceRoot, false)
    const projects = getProjects(nxTree)

    // Get all options
    const tag = core.getInput('tag') || argv.tag
    const target = core.getInput('target', { required: !argv.target }) || argv.target
    const config = core.getInput('config') || argv.config
    const jobIndex = parseInt(core.getInput('index') || '1', 10)
    const jobCount = parseInt(core.getInput('count') || '1', 10)
    const parallel = (core.getInput('parallel') || argv.parallel) as string
    const workingDirectory = core.getInput('workingDirectory') || ''
    const preTargets = core.getMultilineInput('preTargets', {
      trimWhitespace: true
    })
    const postTargets = core.getMultilineInput('postTargets', {
      trimWhitespace: true
    })

    core.debug(`Job index ${jobIndex}`)
    core.debug(`Job count ${jobCount}`)

    core.debug(`Pre targets ${JSON.stringify(preTargets, null, 2)}`)
    core.debug(`Post targets ${JSON.stringify(postTargets, null, 2)}`)

    if (tag) {
      core.info(`Running all projects with tag "${tag}"`)
    }

    const cwd = resolve(process.cwd(), workingDirectory)

    // Get all affected projects
    const affectedProjects = execCommand<string>(
      buildCommand([
        'npx nx print-affected',
        `--target=${target}`,
        '--select=projects'
      ]),
      {
        asString: true,
        silent: !(core.isDebug() || argv.verbose),
        cwd
      }
    ).split(', ')

    const projectsToRun = affectedProjects
      .map((projectName) => projectName.trim())
      .filter((projectName) => {
        if (!projects[projectName]) {
          return false
        }

        const project = projects[projectName]
        projects.set(projectName, project)

        const tags = project.tags || []

        // If the project has ci=off then don't run it
        if (tags.includes('ci=off')) {
          core.debug(`[${projectName}]: Has the "ci=off" tag, skipping it.`)

          return false
        }

        // If a tag is provided the project should have it
        return !tag || tags.includes(tag)
      })

    const sliceSize = Math.max(Math.floor(projectsToRun.length / jobCount), 1)
    const runProjects =
      jobIndex < jobCount
        ? projectsToRun.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
        : projectsToRun.slice(sliceSize * (jobIndex - 1))

    if (preTargets.length > 0) {
      for (const targetParts of preTargets) {
        logger.info(`Running preTarget "${targetParts}"`)

        const [target, targetConfig] = targetParts.split(':')
        await runTarget(
          cwd,
          projects,
          runProjects,
          target,
          targetConfig,
          parallel
        )
      }
    }

    await runTarget(
      cwd,
      projects,
      runProjects,
      target,
      config,
      parallel,
      !argv.target
    )

    if (postTargets.length > 0) {
      for (const targetParts of postTargets) {
        logger.info(`Running postTarget "${targetParts}"`)

        const [target, targetConfig] = targetParts.split(':')
        await runTarget(
          cwd,
          projects,
          runProjects,
          target,
          targetConfig,
          parallel
        )
      }
    }
  } catch (err) {
    core.setFailed(err)
  }
}

run()
