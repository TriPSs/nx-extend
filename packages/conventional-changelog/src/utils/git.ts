import { buildCommand, execCommand } from '@nx-extend/core'

export const getCurrentSha = (): string => {
  const output = execCommand('git rev-parse HEAD', {
    silent: true
  })

  return output.toString().trim()
}

export const createTag = (tag: string, description: string) => {
  return execCommand(buildCommand([
    'git tag',
    `-a ${tag}`,
    `-m "${description}"`
  ]))
}

export const add = () => {
  return execCommand('git add .')
}

export const commit = (message: string) => {
  return execCommand(`git commit -m "${message}"`)
}

export const push = () => {
  const currentBranch = execCommand('git rev-parse --abbrev-ref HEAD').toString().trim()
  // Push all changes

  return execCommand(buildCommand([
    'git push origin',
    currentBranch,
    '--follow-tags'
  ]))
}
