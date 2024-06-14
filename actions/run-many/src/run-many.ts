import * as core from '@actions/core'
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph'
import { resolve } from 'path'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { buildCommand } from './utils/build-command'
import { execCommand } from './utils/exec'
import { hasOneOfRequiredTags } from './utils/has-one-of-required-tags'
import { runTarget } from './utils/run-target'

export const argv = yargs(hideBin(process.argv))
  .options({
    tag: { type: 'string' },
    config: { type: 'string' },
    target: { type: 'string' },
    parallel: { type: 'number' },
    verbose: { type: 'boolean' },
    affectedOnly: { type: 'boolean' }
  })
  .parseSync()

async function run() {
  try {
    // Get all options
    const tagConditions = (argv.tag ? [argv.tag] : core.getMultilineInput('tag', { trimWhitespace: true }))
    const target = core.getInput('target', { required: !argv.target }) || argv.target
    const affectedOnly = argv.affectedOnly !== undefined ? argv.affectedOnly : core.getBooleanInput('affectedOnly')
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

    if (tagConditions.length > 0) {
      core.info(`Running all projects with one of the following tags "${tagConditions.join(', ')}"`)
    }

    const cwd = resolve(process.cwd(), workingDirectory)

    const projectsNamesToRun = JSON.parse(execCommand<string>(
      buildCommand([
        'npx nx show projects --json',
        affectedOnly && '--affected',
        `-t ${target}`
      ]),
      {
        asString: true,
        silent: !(core.isDebug() || argv.verbose),
        cwd
      }
    ))

    // Make sure to still log the project names
    if (!affectedOnly) {
      core.debug(JSON.stringify(projectsNamesToRun))
    }

    const projectGraph = await createProjectGraphAsync()

    // Get all affected projects
    const projectsToRun = projectsNamesToRun.filter((projectName: string) => {
      const project = projectGraph.nodes?.[projectName]?.data

      if (!project) {
        return false
      }

      const tags = project.tags || []

      // If the project has ci=off then don't run it
      if (tags.includes('ci=off')) {
        core.debug(`[${projectName}]: Has the "ci=off" tag, skipping it.`)

        return false
      }

      if (!tagConditions || tagConditions.length === 0) {
        return true
      }

      // If a tag is provided the project should have it
      return (!tagConditions || tagConditions.length === 0) || hasOneOfRequiredTags(projectName, tags, tagConditions)
    }).sort((projectNameA: string, projectNameB: string) => (
      projectNameA.localeCompare(projectNameB)
    ))

    const sliceSize = Math.max(Math.floor(projectsToRun.length / jobCount), 1)
    const runProjects =
      jobIndex < jobCount
        ? projectsToRun.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
        : projectsToRun.slice(sliceSize * (jobIndex - 1))

    if (preTargets.length > 0) {
      for (const targetParts of preTargets) {
        core.info(`Running preTarget "${targetParts}"`)

        const [target, targetConfig] = targetParts.split(':')
        await runTarget(
          cwd,
          projectGraph.nodes,
          runProjects,
          target,
          targetConfig,
          parallel
        )
      }
    }

    await runTarget(
      cwd,
      projectGraph.nodes,
      runProjects,
      target,
      config,
      parallel,
      !argv.target
    )

    if (postTargets.length > 0) {
      for (const targetParts of postTargets) {
        core.info(`Running postTarget "${targetParts}"`)

        const [target, targetConfig] = targetParts.split(':')
        await runTarget(
          cwd,
          projectGraph.nodes,
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
