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
  const { runner, targets, ...rest } = options

  runningTargets = targets.map((targetOptions) => new NxTarget(targetOptions))

  try {
    // Start all targets
    await Promise.all(runningTargets.map((nxTarget) => nxTarget.setup()))

  } catch {
    await killTargets()

    return { success: false }
  }

  try {
    switch (runner) {
      case 'cypress':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cypressExecutor = require('@nx/cypress/src/executors/cypress/cypress.impl').default

        return await cypressExecutor(rest, context)

      case 'playwright':
        logger.warn('Runner "playwright" is no longer maintained in favor of @nx/playwright!')

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const playwrightExecutor = require('@nx-extend/playwright/src/executors/test/test.impl').default

        return await playwrightExecutor(rest, context)

      case '@nx/playwright':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nxPlaywrightExecutor = require('@nx/playwright').playwrightExecutor

        return await nxPlaywrightExecutor(rest, context)

      case 'run-commands':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const runCommandsExecutor = require('nx/src/executors/run-commands/run-commands.impl').default

        return await runCommandsExecutor(rest as RunCommandsOptions, context)

      default:
        throw new Error(`Unknown runner "${runner}"`)
    }
  } finally {
    // Kill all targets
    await killTargets()
  }
}

process.on('exit', () => killTargets())
process.on('SIGINT', () => killTargets())
process.on('SIGTERM', () => killTargets())
process.on('SIGHUP', () => killTargets())

export default endToEndRunner
