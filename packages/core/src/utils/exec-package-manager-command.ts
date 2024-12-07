import {
  detectPackageManager,
  getPackageManagerCommand as nxGetPackageManagerCommand
} from 'nx/src/utils/package-manager'

import { buildCommand } from './build-command'
import { execCommand, Options } from './exec'

export function getPackageManagerDlxCommand() {
  return nxGetPackageManagerCommand(detectPackageManager()).dlx
}

export function getPackageManagerCommand() {
  return process.env.NX_EXTEND_COMMAND_USE_NPX ? 'npx' : getPackageManagerDlxCommand()
}

export function execPackageManagerCommand(command: string, options?: Options) {
  return execCommand(buildCommand([
    getPackageManagerCommand(),
    command
  ]), options)
}
