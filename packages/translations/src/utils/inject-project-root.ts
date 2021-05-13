import { join } from 'path'

export const injectProjectRoot = (string, projectRoot, workspaceRoot) => {
  if (string.includes('<projectRoot>')) {
    return string
      .replace('<projectRoot>', projectRoot)
  }

  return join(workspaceRoot, string)
}
