import { writeJsonFile, readJsonFile } from '@nrwl/devkit'
import { basename } from 'path'

export interface SecretFile {

  __gcp_metadata: {
    status: 'encrypted' | 'decrypted',
    labels?: string[]
    onUpdateBehavior?: 'none' | 'delete' | 'disable'
  }

  [key: string]: any

}

export const getFileContent = (file: string): SecretFile => {
  return readJsonFile(file)
}

export const storeFile = (file: string, content: SecretFile) => {
  writeJsonFile(file, content)
}

export const getFileName = (file: string) => {
  return basename(file)
}
