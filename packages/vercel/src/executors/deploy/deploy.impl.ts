import { buildCommand, execCommand } from '@nx-extend/core'
import { existsSync } from 'fs'
import { join } from 'path'

import type { ExecutorContext } from '@nrwl/devkit'

export interface ExecutorSchema {
  debug?: boolean
}

export function deployExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { targets } = context.workspace.projects[context.projectName]

  if (!targets['build-next']?.options?.outputPath) {
    throw new Error('"build-next" target has no "outputPath" configured!')
  }

  if (!existsSync(join(targets['build-next'].options.outputPath, '.vercel/project.json'))) {
    throw new Error('No ".vercel/project.json" found in dist folder! ')
  }

  return Promise.resolve(execCommand(buildCommand([
    'npx vercel deploy ---prebuilt',
    options.debug && '--debug'
  ]), {
    cwd: targets['build-next'].options.outputPath
  }))
}

export default deployExecutor
