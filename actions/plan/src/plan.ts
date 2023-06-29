import * as core from '@actions/core'

async function run() {
  try {
    // Get all options
    const targets = core.getInput('keys', { required: true })
      .split(',')
      .map((key) => key.trim())

    const matrixInclude = []

    for (const target of targets) {
      core.debug(`Getting info for key ${target}`)

      const tag = core.getInput(`${target}Tag`)
      const maxJobs = parseInt(core.getInput(`${target}MaxJobs`), 10) || 1
      const preTargets = core.getMultilineInput(`${target}PreTargets`) || []
      const postTargets = core.getMultilineInput(`${target}PostTargets`) || []

      for (let i = 0; i < maxJobs; i++) {
        matrixInclude.push({
          target,
          tag,
          preTargets,
          postTargets,
          index: i + 1,
          count: maxJobs
        })
      }
    }

    core.setOutput('matrix', {
      include: matrixInclude
    })
  } catch (err) {
    core.setFailed(err)
  }
}

run()
