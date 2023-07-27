import { File, Storage } from '@google-cloud/storage'
import { join } from 'path'
import { create, extract } from 'tar'

import type { MessageReporter } from './message-reporter'
import type { Bucket } from '@google-cloud/storage'
import type { RemoteCache } from '@nx/workspace/src/tasks-runner/default-tasks-runner'

import { Logger } from './logger'

export class GcpCache implements RemoteCache {

  private readonly bucket: Bucket
  private readonly logger = new Logger()
  private readonly messages: MessageReporter

  public constructor(bucket: string, messages: MessageReporter) {
    this.bucket = new Storage().bucket(bucket)
    this.messages = messages
  }

  public async retrieve(hash: string, cacheDirectory: string): Promise<boolean> {
    if (this.messages.error) {
      return false
    }

    try {
      const commitFile = this.bucket.file(this.getCommitFileName(hash))
      if (!(await commitFile.exists())[0]) {
        this.logger.debug(`Cache miss ${hash}`)

        return false
      }

      this.logger.debug(`Downloading ${hash}`)

      const tarFile = this.bucket.file(this.getTarFileName(hash))
      await this.downloadFile(cacheDirectory, tarFile)
      await this.extractFile(cacheDirectory, tarFile)

      // commit file after we're sure all content is downloaded
      await this.downloadFile(cacheDirectory, commitFile)

      this.logger.success(`Cache hit ${hash}`)

      return true
    } catch (err) {
      this.messages.error = err

      this.logger.error(`Failed to retrieve ${hash}`, err)

      return false
    }
  }

  public store(hash: string, cacheDirectory: string): Promise<boolean> {
    if (this.messages.error) {
      return Promise.resolve(false)
    }

    return this.createAndUploadFile(hash, cacheDirectory)
  }

  private async downloadFile(cacheDirectory: string, file: File) {
    await file.download({ destination: join(cacheDirectory, file.name) })
  }

  private async createAndUploadFile(hash: string, cacheDirectory: string): Promise<boolean> {
    try {
      this.logger.debug(`Storage Cache: Uploading ${hash}`)

      const tarFilePath = this.getTarFilePath(hash, cacheDirectory)
      await this.createTarFile(tarFilePath, hash, cacheDirectory)

      await this.uploadFile(cacheDirectory, this.getTarFileName(hash))
      // commit file once we're sure all content is uploaded
      await this.uploadFile(cacheDirectory, this.getCommitFileName(hash))

      this.logger.debug(`Storage Cache: Stored ${hash}`)

      return true

    } catch (err) {
      this.messages.error = err

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

  private async createTarFile(tgzFilePath: string, hash: string, cacheDirectory: string): Promise<void> {
    try {
      await create({
        gzip: true,
        file: tgzFilePath,
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

  private getTarFilePath(hash: string, cacheDirectory: string): string {
    return join(cacheDirectory, this.getTarFileName(hash))
  }

  private getCommitFileName(hash: string): string {
    return `${hash}.commit`
  }

}
