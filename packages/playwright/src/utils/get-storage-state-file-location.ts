import { workspaceRoot } from '@nrwl/devkit'
import { join, relative } from 'path'

export const getStorageStateFileLocation = (name: string) => {
  let fileName = name
  if (!name.endsWith('.json')) {
    fileName = '.json'
  }

  return join(
    relative(process.cwd(), workspaceRoot), // Offset
    'dist',
    'playwright',
    'storage',
    fileName
  )
}
