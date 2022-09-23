import { execCommand } from '@nx-extend/core'

import type { WebpackExecutorOptions } from '@nrwl/webpack/src/executors/webpack/schema'
// import { existsSync } from 'fs'

export const generatePackageJsonLockFile = (
  root: string,
  projectName: string,
  options: WebpackExecutorOptions
) => {
  // If a yarn.lock file exists then use yarn to generate the lock file
  // if (existsSync(`${root}/yarn.lock`)) {
  //   execCommand('yarn install --mode update-lockfile', { // Was added in v3
  //     cwd: options.outputPath
  //   })
  //
  // } else {
  execCommand('npm i --package-lock-only', {
    cwd: options.outputPath
  })
  // }
}
