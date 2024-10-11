import { ExecutorContext } from '@nx/devkit'
import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'

import 'dotenv/config'

export interface ServeExecutorOptions {
  /** Starts your application with the autoReload enabled and skip the administration panel build process */
  build?: boolean
  /** Starts your application with the autoReload enabled and the front-end development server. It allows you to customize the administration panel. */
  watchAdmin?: boolean
  /** Starts your application with the autoReload enabled and the front-end development server. */
  browser?: string
  envVars?: Record<string, string>
  root?: string
}

export async function serveExecutor(
  options: ServeExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.projectsConfigurations.projects[context.projectName]

  const {
    build = true,
    watchAdmin = false,
    browser = null,
    envVars = {}
  } = options

  return execPackageManagerCommand(buildCommand([
    'strapi develop',
    !build && '--no-build',
    watchAdmin && '--watch-admin',
    browser && `--browser=${browser}`
  ]), {
    cwd: options.root || root,
    env: {
      ...process.env,
      ...envVars
    }
  })
}

export default serveExecutor
