import { ExecutorContext } from '@nx/devkit'
import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'

import 'dotenv/config'

export interface ServeExecutorOptions {
  port?: string
}

export async function serveExecutor(
  options: ServeExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot, root } = context.workspace.projects[context.projectName]

  return execPackageManagerCommand(buildCommand([
    'react-email dev',
    `--dir=${sourceRoot || root}`,
    options.port && `--port=${options.port}`
  ]), {
    env: process.env
  })
}

export default serveExecutor
