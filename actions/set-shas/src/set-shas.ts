import * as core from '@actions/core'
import * as github from '@actions/github'

import { execCommand } from './utils/exec'

async function run() {
  try {
    // Get all options
    const mainBranchName = core.getInput('main-branch-name')

    const headSha = execCommand('git rev-parse HEAD', { asString: true })
    let baseSha

    if (github.context.eventName === 'pull_request') {
      baseSha = execCommand(`git merge-base origin/${mainBranchName} HEAD`)

    } else {
      const tag = execCommand('git describe --tags --abbrev=0', { asString: true })
      baseSha = execCommand(`git rev-parse ${tag}`, { asString: true })
    }

    core.setOutput('base', baseSha)
    core.setOutput('head', headSha)

  } catch (err) {
    core.setFailed(err)
  }
}

run()
