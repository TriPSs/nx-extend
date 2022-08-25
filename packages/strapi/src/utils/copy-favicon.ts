import * as fs from 'fs'
import * as path from 'path'

export function copyFavicon(from: string, toPath: string) {
  const faviconPath = path.join(from, `favicon.ico`)

  if (fs.existsSync(faviconPath)) {
    fs.copyFileSync(faviconPath, `${toPath}/favicon.ico`)
  }
}
