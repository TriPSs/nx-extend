import { File, Storage } from '@google-cloud/storage'
import { join } from 'path'
import { create, extract } from 'tar'

import type { Bucket } from '@google-cloud/storage'

import 'dotenv/config'

import { Logger } from './logger'

export class GcpCache {

  private readonly bucket: Bucket
  private readonly logger = new Logger()
  private hadError = false

  public constructor(bucket: string) {
    this.bucket = new Storage().bucket(bucket)
  }

  public async retrieve(hash: string, cacheDirectory: string): Promise<{
    code: number,
    terminalOutput: string,
    outputsPath: string
  } | false> {
    if (this.hadError) {
      return false
    }

    try {
      const tarFile = this.bucket.file(this.getTarFileName(hash))
      if (!(await tarFile.exists())[0]) {
        this.logger.debug(`Cache miss ${hash}`)

        return false
      }

      this.logger.debug(`Downloading ${hash}`)

      await this.downloadFile(cacheDirectory, tarFile)
      await this.extractFile(cacheDirectory, tarFile)

      this.logger.success(`Cache hit ${hash}`)

      return {
        code: parseInt(
          (await this.bucket.file(this.getCodeFileName(hash)).download()).toString()
        ),
        terminalOutput: (
          await this.bucket.file(this.getTerminalOutFileName(hash)).download()
        ).toString(),
        outputsPath: `${cacheDirectory}/${hash}`
      }
    } catch (err) {
      this.hadError = true

      this.logger.error(`Failed to retrieve ${hash}`, err)

      return false
    }
  }

  public store(hash: string, cacheDirectory: string, terminalOutput: string, code: string): Promise<boolean> {
    if (this.hadError) {
      return Promise.resolve(false)
    }

    return this.createAndUploadFile(hash, cacheDirectory, terminalOutput, code)
  }

  private async downloadFile(cacheDirectory: string, file: File, destination?: string) {
    await file.download({ destination: join(cacheDirectory, destination || file.name) })
  }

  private async createAndUploadFile(hash: string, cacheDirectory: string, terminalOutput: string, code: string): Promise<boolean> {
    try {
      this.logger.debug(`Storage Cache: Uploading ${hash}`)

      const tarFilePath = this.getTarFilePath(hash, cacheDirectory)

      await this.createTarFile(tarFilePath, hash, cacheDirectory)

      // Upload all files
      await this.uploadFile(cacheDirectory, this.getTarFileName(hash))
      await this.uploadFileContent(this.getTerminalOutFileName(hash), terminalOutput.toString())
      await this.uploadFileContent(this.getCodeFileName(hash), code.toString())

      this.logger.debug(`Storage Cache: Stored ${hash}`)

      return true

    } catch (err) {
      this.hadError = true

      this.logger.error(`Storage Cache: Failed to create and upload ${hash}`, err)

      return false
    }
  }

  private async uploadFile(cacheDirectory: string, file: string): Promise<void> {
    const destination = join(cacheDirectory, file)

    try {
      await this.bucket.upload(destination, { destination: file })

    } catch (err) {
      throw new Error(`Storage Cache: Upload error - ${err}`)
    }
  }

  private async uploadFileContent(destination: string, content: string): Promise<void> {
    try {
      await this.bucket.file(destination)
        .save(content, {
          resumable: false
        })

    } catch (err) {
      throw new Error(`Storage Cache: Upload file error - ${err}`)
    }
  }

  private async createTarFile(tarFilePath: string, hash: string, cacheDirectory: string): Promise<void> {
    try {
      await create({
        gzip: true,
        file: tarFilePath,
        cwd: cacheDirectory
      }, [hash])
    } catch (err) {
      this.logger.error(`Error creating tar file for has "${hash}"`, err)

      throw new Error(`Error creating tar file - ${err}`)
    }
  }

  private async extractFile(cacheDirectory: string, file: File): Promise<void> {
    try {
      await extract({
        file: join(cacheDirectory, file.name),
        cwd: cacheDirectory
      })
    } catch (err) {
      this.logger.error(`Error extracting tar file "${file.name}"`, err)

      throw new Error(`\`Error extracting tar file "${file.name}" - ${err}`)
    }
  }

  private getTarFileName(hash: string): string {
    return `${hash}.tar.gz`
  }

  private getCodeFileName(hash: string): string {
    return `${hash}.code.log`
  }

  private getTerminalOutFileName(hash: string): string {
    return `${hash}.terminal-output.log`
  }

  private getTarFilePath(hash: string, cacheDirectory: string): string {
    return join(cacheDirectory, this.getTarFileName(hash))
  }

}
