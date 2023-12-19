import { ExecutorContext } from '@nx/devkit'
import { buildCommand, execPackageManagerCommand } from '@nx-extend/core'

import 'dotenv/config'

export interface ServeExecutorOptions {
  outputPath: string
  pretty?: boolean
  plainText?: boolean
}

export async function exportExecutor(
  options: ServeExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { sourceRoot, root } = context.workspace.projects[context.projectName]

  if (!options.outputPath) {
    throw new Error('No "outputPath" defined in options!')
  }

  return execPackageManagerCommand(buildCommand([
    'email export',
    `--dir=${sourceRoot || root}`,
    `--outDir=${options.outputPath}`,
    options.pretty && `--pretty`,
    options.plainText && `--plainText`
  ]), {
    env: process.env
  })
}

export default exportExecutor
