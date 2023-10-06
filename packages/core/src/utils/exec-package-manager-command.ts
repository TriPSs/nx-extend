import { detectPackageManager, getPackageManagerCommand } from 'nx/src/utils/package-manager'

import { buildCommand } from './build-command'
import { execCommand, Options } from './exec'

export function getPackageManagerExecCommand() {
  return getPackageManagerCommand(detectPackageManager()).exec
}

export function execPackageManagerCommand(command: string, options?: Options) {
  return execCommand(buildCommand([
    getPackageManagerExecCommand(),
    command
  ]), options)
}
