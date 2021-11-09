import * as fs from 'fs'
import * as path from 'path'

export const getAllSecretFiles = (projectRoot: string) => {
  const filesInDirectory = fs.readdirSync(projectRoot, { withFileTypes: true })

  const files = filesInDirectory.map((file) => {
    if (file.name === 'status') {
      return false
    }

    const res = path.resolve(projectRoot, file.name)

    return file.isDirectory()
      ? getAllSecretFiles(res)
      : res
  }).filter(Boolean)

  return Array.prototype.concat(...files)
}
