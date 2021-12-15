import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'
import { execCommand } from '@nx-extend/core'
import { existsSync } from 'fs'

export const generatePackageJsonLockFile = (
  root: string,
  projectName: string,
  options: BuildNodeBuilderOptions
) => {
  // If a yarn.lock file exists then use yarn to generate the lock file
  if (existsSync(`${root}/yarn.lock`)) {
    execCommand('yarn generate-lock-entry', {
      cwd: options.outputPath
    })

  } else {
    execCommand('npm i --package-lock-only', {
      cwd: options.outputPath
    })
  }
}
