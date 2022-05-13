import { ExecutorContext, runExecutor, logger } from '@nrwl/devkit'
import cypressExecutor, { CypressExecutorOptions } from '@nrwl/cypress/src/executors/cypress/cypress.impl'

import { isApiLive } from './utils/is-api-live'
import { wait } from './utils/wait'

interface Options extends CypressExecutorOptions {
  serverTarget: string
  serverCheckUrl: string
}

async function* startDevServer(
  options: Options,
  context: ExecutorContext
) {
  const [project, target, configuration] = options.serverTarget.split(':')

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
  }>({ project, target, configuration },
    { watch: options.watch },
    context
  )) {
    if (!output.success && !options.watch) {
      throw new Error('Could not compile application files')
    }

    if (options.serverCheckUrl) {
      while (!await isApiLive(options.serverCheckUrl)) {
        logger.info('Api is not live yet, waiting...')
        await wait(2)
      }
    }

    yield '' || (output.baseUrl as string)
  }
}

export async function endToEndRunner(
  options: Options,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  let success
  for await (const _ of startDevServer(options, context)) {
    try {
      success = await cypressExecutor(options, context)

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

  return { success }
}

export default endToEndRunner