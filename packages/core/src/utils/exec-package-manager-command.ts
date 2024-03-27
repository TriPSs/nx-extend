import { detectPackageManager, getPackageManagerCommand } from 'nx/src/utils/package-manager'

import { buildCommand } from './build-command'
import { execCommand, Options } from './exec'

export function getPackageManagerDlxCommand() {
  return getPackageManagerCommand(detectPackageManager()).dlx
}

export function execPackageManagerCommand(command: string, options?: Options) {
  return execCommand(buildCommand([
    process.env.NX_EXTEND_COMMAND_USE_NPX ? 'npx' : getPackageManagerDlxCommand(),
    command
  ]), options)
}
