import * as core from '@actions/core'
import * as github from '@actions/github'

import { execCommand } from './utils/exec'

async function run() {
  try {
    // Get all options
    const mainBranchName = core.getInput('main-branch-name')

    core.info(`Got head sha "${github.context.sha}"`)
    let baseSha

    if (github.context.eventName === 'pull_request') {
      core.info(`This is a pull request, get sha from "origin/${mainBranchName}"`)
      baseSha = execCommand(`git merge-base origin/${mainBranchName} HEAD`, {
        asString: true,
        silent: !core.isDebug()
      })

    } else {
      const tag = execCommand('git describe --tags --abbrev=0', {
        asString: true,
        silent: !core.isDebug()
      })
      baseSha = execCommand(`git rev-parse ${tag}`, {
        asString: true,
        silent: !core.isDebug()
      })

      core.info(`Got base sha "${baseSha}" from "${tag}"`)
    }

    core.setOutput('base', baseSha)
    core.exportVariable('NX_BASE', baseSha)
    core.setOutput('head', github.context.sha)
    core.exportVariable('NX_HEAD', github.context.sha)

  } catch (err) {
    core.setFailed(err)
  }
}

run()
