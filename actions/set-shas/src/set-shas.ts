import * as core from '@actions/core'
import * as github from '@actions/github'

import { execCommand } from './utils/exec'

async function run() {
  try {
    core.info(`Got head sha "${github.context.sha}"`)
    let baseSha: string

    if (github.context.eventName === 'pull_request') {
      core.info(`This is a pull request, get sha from "origin/${github.context.payload.pull_request.base.ref}"`)
      baseSha = github.context.payload.pull_request.base.sha

      core.info(`Got base sha "${baseSha}" from "origin/${github.context.payload.pull_request.base.ref}"`)

    } else {
      const tag = execCommand('git describe --tags --abbrev=0', {
        asString: true,
        silent: !core.isDebug()
      })

      if (!tag) {
        core.warning(`No tags found, get base sha from origin!`)

        baseSha = execCommand(`git rev-parse origin/${core.getInput('main-branch-name')}~1`, {
          asString: true,
          silent: !core.isDebug()
        })

      } else {
        baseSha = execCommand(`git rev-parse ${tag}^{commit}`, {
          asString: true,
          silent: !core.isDebug()
        })
      }

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
