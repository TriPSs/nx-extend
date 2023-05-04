import { Tree } from '@nx/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'

export interface AddOptions {
  name: string
  origination?: string
  createProject?: boolean
}

export default async function AddVercel(host: Tree, options: AddOptions) {
  execCommand('echo "TODO"')
  // execCommand(buildCommand([
  //   'npx vercel projects add <project name>',
  // ]))
}
