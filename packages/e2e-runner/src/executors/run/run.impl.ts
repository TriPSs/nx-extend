import { ExecutorContext, runExecutor, logger } from '@nrwl/devkit'
import cypressExecutor, { CypressExecutorOptions } from '@nrwl/cypress/src/executors/cypress/cypress.impl'

import { isApiLive } from './utils/is-api-live'
import { wait } from './utils/wait'

interface Options extends CypressExecutorOptions {
  serverTarget: string
  serverCheckUrl: string
  serverCheckMaxTries?: number
}

let waitTries = 0
const defaultMaxTries = 15

async function* startDevServer(
  options: Options,
  context: ExecutorContext
) {
  const [project, target, configuration] = options.serverTarget.split(':')

  let serverIsLive = false

  for await (const output of await runExecutor<{ success: boolean; }>({ project, target, configuration },
    { watch: options.watch },
    context
  )) {
    if (!output.success && !options.watch) {
      throw new Error('Could not compile application files')
    }

    if (options.serverCheckUrl) {
      while (!serverIsLive) {
        logger.info('Api is not live yet, waiting...')

        await wait(2)
        waitTries++

        if (waitTries >= (options.serverCheckMaxTries || defaultMaxTries)) {
          break
        }

        serverIsLive = await isApiLive(options.serverCheckUrl)
      }

    } else {
      serverIsLive = true
    }

    yield serverIsLive
  }
}

export async function endToEndRunner(options: Options, context: ExecutorContext): Promise<{ success: boolean }> {
  let success

  for await (const serverLive of startDevServer(options, context)) {
    try {
      if (serverLive) {
        success = await cypressExecutor(options, context)

      } else {
        success = false
        break
      }

      if (!options.watch) {
        break
      }
    } catch (e) {
      logger.error(e.message)

      success = false

      if (!options.watch) {
        break
      }
    }
  }

  return success
}

export default endToEndRunner