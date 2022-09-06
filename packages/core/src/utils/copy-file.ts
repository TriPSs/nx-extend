import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

export function copyFile(from: string, toPath: string, fileName: string) {
  const fileToCopy = join(from, fileName)

  if (existsSync(from)) {
    copyFileSync(fileToCopy, join(toPath, fileName))
  }
}
