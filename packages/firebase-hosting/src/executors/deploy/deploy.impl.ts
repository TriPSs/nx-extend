import { execCommand, buildCommand } from '@nx-extend/core'
import { ExecutorSchema } from './schema'

export default async function runExecutor(options: ExecutorSchema) {
  // Make sure the deployment target is defined
  await execCommand(buildCommand([
    'npx firebase target:apply',
    `hosting ${options.site} ${options.site}`
  ]))

  return execCommand(buildCommand([
    'npx firebase deploy',
    `--only=hosting:${options.site}`
  ]))
}
