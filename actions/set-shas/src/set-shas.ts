import * as core from '@actions/core'

import { execCommand } from './utils/exec'

async function run() {
  try {
    // Get all options
    const mainBranchName = core.getInput('mainBranchName')
    const eventName = core.getInput('eventName')

    const headSha = execCommand('git rev-parse HEAD', { asString: true })
    let baseSha

    if (eventName === 'pull_request') {
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
