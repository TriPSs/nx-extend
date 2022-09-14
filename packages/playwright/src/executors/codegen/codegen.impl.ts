import { buildCommand, execCommand } from '@nx-extend/core'

import type { ExecutorContext } from '@nrwl/devkit'

export interface CodegenOptions {
  url?: string
  loadStorage?: string
}

export async function codegenExecutor(
  options: CodegenOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.workspace.projects[context.projectName]

  const { url, loadStorage } = options

  return Promise.resolve(execCommand(buildCommand([
    'npx playwright codegen',
    url,
    loadStorage && `--load-storage ${options.loadStorage}`

    // TODO:: Map all other options
  ]), {
    cwd: root
  }))
}

export default codegenExecutor
