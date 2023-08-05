import * as core from '@actions/core'
import { FsTree } from 'nx/src/generators/tree'
import { getProjects } from 'nx/src/generators/utils/project-configuration'
import { resolve } from 'path'

import { execCommand } from './utils/exec'
import { cleanLogConditions, hasOneOfRequiredTags } from './utils/has-one-of-required-tags'

async function run() {
  try {
    const nxTree = new FsTree(process.cwd(), false)
    const projects = getProjects(nxTree)

    const workingDirectory = core.getInput('workingDirectory') || ''
    const affectedOnly = core.getBooleanInput('affectedOnly')
    const targets = core.getMultilineInput('targets', { required: true, trimWhitespace: true })

    // Get all affected projects
    const affectedProjects = execCommand<string>(
      `npx nx show projects ${affectedOnly ? '--affected' : ''}`,
      {
        asString: true,
        silent: !core.isDebug(),
        cwd: resolve(process.cwd(), workingDirectory)
      }
    ).split('\n')
      .map((projectName) => projectName.trim())
      .filter((projectName) => {
        if (!projects.has(projectName)) {
          return false
        }

        return !(projects.get(projectName).tags || []).includes('ci=off')
      })

    const matrixInclude = []

    for (const target of targets) {
      const tagConditions = core.getMultilineInput(`${target}Tag`, { trimWhitespace: true })
      const maxJobs = parseInt(core.getInput(`${target}MaxJobs`), 10) || 1
      const parallel = core.getInput(`${target}Parallel`)
      const preTargets = core.getMultilineInput(`${target}PreTargets`) || []
      const postTargets = core.getMultilineInput(`${target}PostTargets`) || []

      core.startGroup(`Target "${target}"`)
      core.info(`- ${target}Tag: ${cleanLogConditions(tagConditions)}`)
      core.info(`- ${target}MaxJobs: ${maxJobs}`)
      core.info(`- ${target}Parallel: ${parallel}`)
      core.info(`- ${target}PreTargets: ${preTargets.join(' AND ')}`)
      core.info(`- ${target}PostTargets: ${postTargets.join(' AND ')}`)

      const amountOfProjectsWithTarget = affectedProjects
        .map((projectName) => {
          const { targets, tags } = projects.get(projectName)

          if (Object.keys(targets).includes(target)) {
            return hasOneOfRequiredTags(projectName, tags, tagConditions)
          }

          return false
        })
        .filter(Boolean)

      if (amountOfProjectsWithTarget.length === 0) {
        let debugMessage = `No projects changed with target "${target}"`
        if (tagConditions.length > 0) {
          debugMessage += ` and matching one of the following conditions "${tagConditions.join(', ')}"`
        }

        core.debug(debugMessage)
        continue
      }

      core.info(`Found ${amountOfProjectsWithTarget.length} projects that match the required conditions`)

      let maxJobCount = 1
      for (let i = maxJobs; i > 0; i--) {
        // Each job needs to at-least run 2 projects
        if ((amountOfProjectsWithTarget.length / i) >= 2) {
          maxJobCount = i
          break
        }
      }

      for (let i = 0; i < maxJobCount; i++) {
        matrixInclude.push({
          target,
          tag: tagConditions
            .join('\n'),
          preTargets: preTargets.join('\n'),
          postTargets: postTargets.join('\n'),
          index: i + 1,
          count: maxJobCount,
          parallel
        })
      }

      core.endGroup()
    }

    core.info('\n')
    core.info(`Created following plan: \n${JSON.stringify(matrixInclude, null, 2)}`)
    core.setOutput('matrix', {
      include: matrixInclude
    })
    core.setOutput('hasPlan', matrixInclude.length > 0)
  } catch (err) {
    core.setFailed(err)
  }
}

run()
