import { ExecutorContext } from '@nrwl/devkit'
import { execCommand } from '@nx-extend/core'

export async function serveExecutor(
  options,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.workspace.projects[context.projectName]

  return Promise.resolve(execCommand('npx strapi develop', {
    cwd: root
  }))
}

export default serveExecutor
