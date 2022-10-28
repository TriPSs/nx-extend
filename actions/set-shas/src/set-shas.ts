import * as core from '@actions/core'
import * as github from '@actions/github'

import { execCommand } from './utils/exec'

async function run() {
  try {
    // Get all options
    const mainBranchName = core.getInput('main-branch-name')

    const headSha = execCommand('git rev-parse HEAD', {
      asString: true,
      silent: !core.isDebug()
    })
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

      core.info(`Got base sha from "${tag}"`)
    }

    core.setOutput('base', baseSha)
    core.exportVariable('NX_BASE', baseSha)
    core.setOutput('head', headSha)
    core.exportVariable('NX_HEAD', headSha)

  } catch (err) {
    core.setFailed(err)
  }
}

run()
