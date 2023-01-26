import { createLockFile } from '@nrwl/devkit'
import webpackExecutor, { WebpackExecutorEvent } from '@nrwl/webpack/src/executors/webpack/webpack.impl'

import type { ExecutorContext } from '@nrwl/devkit'
import type { WebpackExecutorOptions } from '@nrwl/webpack/src/executors/webpack/schema'

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
    ...rawOptions
  } as WebpackExecutorOptions

  const { value } = await webpackExecutor(options, context)
    .next()

  if (value.success) {
    generatePackageJson(context, options, value.outfile, rawOptions.generateLockFile)
  }

  return value
}

export default buildExecutor
