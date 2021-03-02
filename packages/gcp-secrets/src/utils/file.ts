import * as fs from 'fs'
import * as path from 'path'

export interface SecretFile {

  __gcp_metadata: {
    status: 'encrypted' | 'decrypted',
    labels?: string[]
    onUpdateBehavior?: 'none' | 'delete' | 'disable'
  }

  [key: string]: any

}

export const getFileContent = (file: string): SecretFile => {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export const storeFile = (file: string, content: SecretFile) => {
  fs.writeFileSync(file, JSON.stringify(content, null, 2), 'utf8')
}

export const getFileName = (file: string) => {
  return path.basename(file)
}
