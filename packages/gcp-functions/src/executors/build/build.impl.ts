import webpackExecutor, { WebpackExecutorEvent } from '@nx/webpack/src/executors/webpack/webpack.impl'

import type { ExecutorContext } from '@nx/devkit'
import type { WebpackExecutorOptions } from '@nx/webpack/src/executors/webpack/schema'

import { generatePackageJson } from '../../utils/generate-package-json'

export interface RawOptions extends WebpackExecutorOptions {
  generateLockFile?: boolean
}

export async function buildExecutor(
  rawOptions: RawOptions,
  context: ExecutorContext
): Promise<WebpackExecutorEvent> {
  const options = {
    target: 'node',
    compiler: 'tsc',
    ...rawOptions,
    generatePackageJson: false
  } as WebpackExecutorOptions

  const { value } = await webpackExecutor(options, context).next()

  if (value.success) {
    generatePackageJson(
      context,
      options,
      value.outfile,
      rawOptions.generateLockFile
    )
  }

  return value
}

export default buildExecutor
