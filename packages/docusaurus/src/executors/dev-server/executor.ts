import { start } from '@docusaurus/core/lib'
import { ExecutorContext } from '@nx/devkit'
import * as path from 'path'

import { DevServerExecutorSchema } from './schema'

export default async function* runExecutor(
  options: DevServerExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot = path.join(
    context.root,
    context.workspace.projects[context.projectName ?? ''].root
  )
  const port = options.port.toString()

  await start(projectRoot, {
    port,
    host: options.host,
    hotOnly: options.hotOnly,
    open: options.open
  })

  yield {
    baseUrl: `http://localhost:${port}`,
    success: true
  }

  // This Promise intentionally never resolves, leaving the process running
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  await new Promise<{ success: boolean }>(() => {})
}
