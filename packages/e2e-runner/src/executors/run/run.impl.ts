import { ExecutorContext } from '@nrwl/devkit'

import { NxTarget, NxTargetOptions } from './utils/nx-target'

interface Options {
  runner: 'cypress' | 'playwright'
  runnerTarget?: string
  watch?: boolean
  targets: NxTargetOptions[]
}

export async function endToEndRunner(options: Options, context: ExecutorContext): Promise<{ success: boolean }> {
  let success: boolean

  const { runner, targets, ...rest } = options

  const runningTargets = targets.map((targetOptions) => new NxTarget(targetOptions))

  // Start all targets
  await Promise.all(runningTargets.map((nxTarget) => nxTarget.setup()))

  try {
    if (runner === 'cypress') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cypressExecutor = require('@nrwl/cypress/src/executors/cypress/cypress.impl').default
      success = (await cypressExecutor(rest, context)).success

    } else if (runner === 'playwright') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const playwrightExecutor = require('@nx-extend/playwright/src/executors/test/test.impl').default
      success = (await playwrightExecutor(rest, context)).success

    } else {
      throw new Error(`Unknown runner "${runner}"`)
    }
  } catch (error) {
    console.error(error)

    success = false
  }

  // Kill all targets
  await Promise.all(runningTargets.map((nxTarget) => nxTarget.teardown()))

  return { success }
}

export default endToEndRunner