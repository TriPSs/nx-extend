import { ExecutorContext, logger } from '@nx/devkit'
import { RunCommandsOptions } from 'nx/src/executors/run-commands/run-commands.impl'

import { NxTarget, NxTargetOptions } from './utils/nx-target'

export interface RunOptions {
  runner: 'cypress' | 'playwright' | '@nx/playwright' | 'run-commands'
  runnerTarget?: string
  watch?: boolean
  targets: NxTargetOptions[]
}

let runningTargets = []

async function killTargets() {
  // Kill all targets
  await Promise.all(runningTargets.map((nxTarget) => nxTarget.teardown()))
}

export async function endToEndRunner(
  options: RunOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  let success: boolean

  const { runner, targets, ...rest } = options

  runningTargets = targets.map((targetOptions) => new NxTarget(targetOptions, options))

  try {
    // Start all targets
    await Promise.all(runningTargets.map((nxTarget) => nxTarget.setup()))
  } catch {
    await killTargets()

    return { success: false }
  }

  try {
    if (runner === 'cypress') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cypressExecutor = require('@nx/cypress/src/executors/cypress/cypress.impl').default

      success = (await cypressExecutor(rest, context)).success
    } else if (runner === 'playwright') {
      logger.warn('Runner "playwright" is no longer maintained in favor of @nx/playwright!')

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const playwrightExecutor = require('@nx-extend/playwright/src/executors/test/test.impl').default

      success = (await playwrightExecutor(rest, context)).success
    } else if (runner === '@nx/playwright') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const playwrightExecutor = require('@nx/playwright').playwrightExecutor

      success = (await playwrightExecutor(rest, context)).success
    } else if (runner === 'run-commands') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const runCommandsExecutor = require('nx/src/executors/run-commands/run-commands.impl').default

      success = (await runCommandsExecutor(rest as RunCommandsOptions, context)).success
    } else {
      throw new Error(`Unknown runner "${runner}"`)
    }
  } catch (error) {
    console.error(error)

    success = false
  }

  // Kill all targets
  await killTargets()

  return { success }
}

process.on('exit', () => killTargets())
process.on('SIGINT', () => killTargets())
process.on('SIGTERM', () => killTargets())
process.on('SIGHUP', () => killTargets())

export default endToEndRunner
