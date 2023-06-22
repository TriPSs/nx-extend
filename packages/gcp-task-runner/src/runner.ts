import defaultTaskRunner from '@nx/workspace/tasks-runners/default'

import { GcpCache } from './gcp-cache'
import { Logger } from './logger'
import { MessageReporter } from './message-reporter'

export const tasksRunner = (
  tasks: Parameters<typeof defaultTaskRunner>[0],
  options: Parameters<typeof defaultTaskRunner>[1] & { bucket: string },
  context: Parameters<typeof defaultTaskRunner>[2]
): ReturnType<typeof defaultTaskRunner> => {
  // Create the logger
  const logger = new Logger()

  try {
    const messages = new MessageReporter(logger)
    const remoteCache = new GcpCache(options.bucket, messages)

    return defaultTaskRunner(
      tasks,
      {
        ...options,
        remoteCache
      },
      context
    )
  } catch (err) {
    logger.warn('Error running with remote cache, fallback to default!', err)

    return defaultTaskRunner(tasks, options, context)
  }
}

export default tasksRunner
