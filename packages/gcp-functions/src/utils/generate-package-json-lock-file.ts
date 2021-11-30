import { join } from 'path'
import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'
import { execCommand } from '@nx-extend/core'

export const generatePackageJsonLockFile = (
  projectName: string,
  options: BuildNodeBuilderOptions,
  workspaceRoot: string
) => {
  execCommand('npm i --package-lock-only', {
    cwd: join(workspaceRoot, options.outputPath)
  })
}
