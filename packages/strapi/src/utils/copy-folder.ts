import * as fs from 'fs'
import * as path from 'path'

export function copyFolderSync(from, to) {
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(path.join(from, element))
    const toPath = path.join(to, element)

    if (stat.isFile()) {
      // Make sure the directory exists
      fs.mkdirSync(path.dirname(toPath), { recursive: true })

      fs.copyFileSync(path.join(from, element), toPath)

    } else if (stat.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(path.join(from, element)), toPath)

    } else if (stat.isDirectory() && element !== 'node_modules') {
      copyFolderSync(path.join(from, element), toPath)
    }
  })
}