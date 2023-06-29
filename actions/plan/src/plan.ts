import * as core from '@actions/core'
import { FsTree } from 'nx/src/generators/tree'
import { getProjects } from 'nx/src/generators/utils/project-configuration'
import { resolve } from 'path'

import { execCommand } from './utils/exec'
import { hasOneOfRequiredTags } from './utils/has-one-of-required-tags'

async function run() {
  try {
    const nxTree = new FsTree(process.cwd(), false)
    const projects = getProjects(nxTree)

    const workingDirectory = core.getInput('workingDirectory') || ''
    const targets = core.getMultilineInput('targets', { required: true, trimWhitespace: true })

    // Get all affected projects
    const affectedProjects = execCommand<string>(
      'npx nx print-affected --select=projects',
      {
        asString: true,
        silent: !core.isDebug(),
        cwd: resolve(process.cwd(), workingDirectory)
      }
    ).split(', ')
      .map((projectName) => projectName.trim())
      .filter((projectName) => {
        if (!projects.has(projectName)) {
          return false
        }

        return !(projects.get(projectName).tags || []).includes('ci=off')
      })

    const matrixInclude = []

    for (const target of targets) {
      core.debug(`Getting info for target "${target}"`)

      const requiresOnOfTheseTags = core.getMultilineInput(`${target}Tag`, { trimWhitespace: true })
      const maxJobs = parseInt(core.getInput(`${target}MaxJobs`), 10) || 1
      const preTargets = core.getMultilineInput(`${target}PreTargets`) || []
      const postTargets = core.getMultilineInput(`${target}PostTargets`) || []

      const amountOfProjectsWithTarget = affectedProjects
        .map((projectName) => {
          const { targets, tags } = projects.get(projectName)

          if (Object.keys(targets).includes(target)) {
            return hasOneOfRequiredTags(tags, requiresOnOfTheseTags)
          }

          return false
        })
        .filter(Boolean)

      if (amountOfProjectsWithTarget.length === 0) {
        let debugMessage = `No projects changed with target "${target}"`
        if (requiresOnOfTheseTags.length > 0) {
          debugMessage += ` and one of the following tags "${requiresOnOfTheseTags.join(', ')}"`
        }

        core.debug(debugMessage)
        continue
      }

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
          tag: requiresOnOfTheseTags
            .join('\n'),
          preTargets: preTargets.join('\n'),
          postTargets: postTargets.join('\n'),
          index: i + 1,
          count: maxJobCount
        })
      }
    }

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
