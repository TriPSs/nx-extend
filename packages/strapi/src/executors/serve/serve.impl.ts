import { ExecutorContext } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'

export interface ServeExecutorOptions {
  /** Starts your application with the autoReload enabled and skip the administration panel build process */
  build?: boolean;
  /** Starts your application with the autoReload enabled and the front-end development server. It allows you to customize the administration panel. */
  watchAdmin?: boolean;
  /** Starts your application with the autoReload enabled and the front-end development server. */
  browser?: string;
}

export async function serveExecutor(
  options: ServeExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.workspace.projects[context.projectName]

  const {
    build = true,
    watchAdmin = false,
    browser = null,
  } = options

  const developCommand = buildCommand([
    'npx strapi develop',
    !build && '--no-build',
    watchAdmin && '--watch-admin',
    browser && `--browser=${browser}`,
  ])

  return Promise.resolve(execCommand(developCommand, {
    cwd: root
  }))
}

export default serveExecutor
