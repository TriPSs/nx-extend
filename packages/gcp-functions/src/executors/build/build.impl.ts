import webpackExecutor, { WebpackExecutorEvent } from '@nx/webpack/src/executors/webpack/webpack.impl'
import { join } from 'path'

import type { ExecutorContext } from '@nx/devkit'
import type { WebpackExecutorOptions } from '@nx/webpack/src/executors/webpack/schema'

import { generatePackageJson } from '../../utils/generate-package-json'

export interface RawOptions extends WebpackExecutorOptions {
  generateLockFile?: boolean
  omitOptionalDependencies?: boolean
}

export async function buildExecutor(
  rawOptions: RawOptions,
  context: ExecutorContext
): Promise<WebpackExecutorEvent> {
  const options = {
    target: 'node',
    compiler: 'tsc',

    // TODO:: Remove once the issues with the defaults are fixed
    // https://github.com/nrwl/nx/pull/20678
    webpackConfig: join(__dirname, 'webpack.config.js'),
    isolatedConfig: true,

    ...rawOptions,
    generatePackageJson: false
  } as WebpackExecutorOptions

  const { value } = await webpackExecutor(options, context).next()

  if (value.success) {
    generatePackageJson(
      context,
      options,
      value.outfile,
      rawOptions.omitOptionalDependencies,
      rawOptions.generateLockFile
    )
  }

  return value
}

export default buildExecutor
