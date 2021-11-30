import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'
import { execCommand } from '@nx-extend/core'

export const generatePackageJsonLockFile = (
  projectName: string,
  options: BuildNodeBuilderOptions
) => {
  execCommand('npm i --package-lock-only', {
    cwd: options.outputPath
  })
}
