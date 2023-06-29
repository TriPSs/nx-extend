import * as core from '@actions/core'
import { workspaceRoot } from '@nx/devkit'
import { FsTree } from 'nx/src/generators/tree'
import { getProjects } from 'nx/src/generators/utils/project-configuration'
import { resolve } from 'path'

import { execCommand } from './utils/exec'

async function run() {
  try {
    console.log('workspaceRoot',workspaceRoot)
    const nxTree = new FsTree(workspaceRoot, false)
    const projects = getProjects(nxTree)

    const workingDirectory = core.getInput('workingDirectory') || ''
    const targets = core.getInput('targets', { required: true })
      .split(',')
      .map((key) => key.trim())

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

      const tag = core.getInput(`${target}Tag`)
      const maxJobs = parseInt(core.getInput(`${target}MaxJobs`), 10) || 1
      const preTargets = core.getMultilineInput(`${target}PreTargets`) || []
      const postTargets = core.getMultilineInput(`${target}PostTargets`) || []

      const amountOfProjectsWithTarget = affectedProjects
        .map((projectName) => {
          const { targets, tags } = projects.get(projectName)

          if (Object.keys(targets).includes(target)) {
            return !tag || (tags || []).includes(tag)
          }

          return false
        })
        .filter(Boolean)

      if (amountOfProjectsWithTarget.length === 0) {
        core.debug(`No projects changed with target "${target}"${tag ? ` and tag "${tag}"` : ''}`)
        continue
      }

      const maxJobCount = amountOfProjectsWithTarget.length >= maxJobs
        ? maxJobs
        : 1

      for (let i = 0; i < maxJobCount; i++) {
        matrixInclude.push({
          target,
          tag,
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
