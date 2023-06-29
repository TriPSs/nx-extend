import * as core from '@actions/core'

async function run() {
  try {
    // Get all options
    const targets = core.getInput('targets', { required: true })
      .split(',')
      .map((key) => key.trim())

    const matrixInclude = []

    for (const target of targets) {
      core.debug(`Getting info for key ${target}`)

      const tag = core.getInput(`${target}Tag`)
      const maxJobs = parseInt(core.getInput(`${target}MaxJobs`), 10) || 1
      const preTargets = core.getMultilineInput(`${target}PreTargets`) || []
      const postTargets = core.getMultilineInput(`${target}PostTargets`) || []

      // TODO:: Validate that the projects actually changed
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
