import { AES, enc } from 'crypto-js'
import { SecretFile } from './file'

const {
  GCP_SECRETS_ENCRYPTION_KEY
} = process.env

export const isEncryptionKeySet = (): boolean => {
  if (!GCP_SECRETS_ENCRYPTION_KEY) {
    console.warn('No "GCP_SECRETS_ENCRYPTION_KEY" set, skipping...')
  }

  return !!GCP_SECRETS_ENCRYPTION_KEY
}

export const getEncryptionKey = (): string => {
  return GCP_SECRETS_ENCRYPTION_KEY
}

/**
 * Encrypts the content text but only if its a string and not empty
 */
export const encrypt = (content: string): string => {
  if (typeof content === 'string' && content.trim().length > 0) {
    return AES.encrypt(content, getEncryptionKey()).toString()

  } else {
    return content
  }
}

/**
 * Decrypts the cipher text but only if its a string and not empty
 */
export const decrypt = (cipherText: string): string => {
  if (typeof cipherText === 'string' && cipherText.trim().length > 0) {
    return AES.decrypt(cipherText, getEncryptionKey()).toString(enc.Utf8)

  } else {
    return cipherText
  }
}

export const decryptFile = (encryptedFileContent: SecretFile, removeMetadata = false): SecretFile => {
  return Object.keys(encryptedFileContent).reduce((secretFile: SecretFile, fileKey: string) => {
      // Don't update __gcp_metadata
      if (fileKey !== '__gcp_metadata') {
        secretFile[fileKey] = decrypt(encryptedFileContent[fileKey])

      } else if (!removeMetadata) {
        secretFile[fileKey] = {
          ...encryptedFileContent[fileKey],
          ...secretFile[fileKey]
        }
      }

      return secretFile
    },
    (
      removeMetadata
        ? {}
        : {
          __gcp_metadata: {
            status: 'decrypted'
          }
        }
    ) as SecretFile
  )
}

export const encryptFile = (decryptedFileContent: SecretFile): SecretFile => {
  return Object.keys(decryptedFileContent).reduce((secretFile: SecretFile, fileKey: string) => {
    // Don't update __gcp_metadata
    if (fileKey !== '__gcp_metadata') {
      secretFile[fileKey] = encrypt(decryptedFileContent[fileKey])
    } else {
      secretFile[fileKey] = {
        ...decryptedFileContent[fileKey],
        ...secretFile[fileKey]
      }
    }

    return secretFile
  }, {
    __gcp_metadata: {
      status: 'encrypted'
    }
  })
}

