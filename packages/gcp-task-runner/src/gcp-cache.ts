import { File, Storage } from '@google-cloud/storage'
import { mkdirSync, promises } from 'fs'
import { dirname, join, relative } from 'path'

import type { MessageReporter } from './message-reporter'
import type { Bucket, UploadResponse } from '@google-cloud/storage'
import type { RemoteCache } from '@nx/workspace/src/tasks-runner/default-tasks-runner'

import { Logger } from './logger'

export class GcpCache implements RemoteCache {
  private readonly bucket: Bucket

  private readonly logger = new Logger()

  private readonly messages: MessageReporter

  private uploadQueue: Array<Promise<UploadResponse>> = []

  public constructor(bucket: string, messages: MessageReporter) {
    this.bucket = new Storage().bucket(bucket)
    this.messages = messages
  }

  public async retrieve(
    hash: string,
    cacheDirectory: string
  ): Promise<boolean> {
    if (this.messages.error) {
      return false
    }

    try {
      this.logger.debug(`Downloading ${hash}`)

      const commitFile = this.bucket.file(`${hash}.commit`)

      if (!(await commitFile.exists())[0]) {
        this.logger.debug(`Cache miss ${hash}`)

        return false
      }

      // Get all the files for this hash
      const [files] = await this.bucket.getFiles({ prefix: `${hash}/` })

      // Download all the files
      await Promise.all(
        files.map((file) => this.downloadFile(cacheDirectory, file))
      )

      await this.downloadFile(cacheDirectory, commitFile) // commit file after we're sure all content is downloaded

      this.logger.success(`Cache hit ${hash}`)

      return true
    } catch (err) {
      this.messages.error = err

      this.logger.error(`Failed to retrieve ${hash}`, err)

      return false
    }
  }

  public async store(hash: string, cacheDirectory: string): Promise<boolean> {
    if (this.messages.error) {
      return Promise.resolve(false)
    }

    try {
      await this.createAndUploadFiles(hash, cacheDirectory)

      return true
    } catch (err) {
      this.logger.warn(`Failed to upload cache`, err)

      return false
    }
  }

  private async downloadFile(cacheDirectory: string, file: File) {
    const destination = join(cacheDirectory, file.name)
    mkdirSync(dirname(destination), {
      recursive: true
    })

    await file.download({ destination })
  }

  private async createAndUploadFiles(
    hash: string,
    cacheDirectory: string
  ): Promise<boolean> {
    try {
      this.logger.debug(`Storage Cache: Uploading ${hash}`)

      // Add all the files to the upload queue
      await this.uploadDirectory(cacheDirectory, join(cacheDirectory, hash))
      // Upload all the files
      await Promise.all(this.uploadQueue)

      // commit file once we're sure all content is uploaded
      await this.bucket.upload(join(cacheDirectory, `${hash}.commit`))

      this.logger.debug(`Storage Cache: Stored ${hash}`)
    } catch (err) {
      this.messages.error = err

      this.logger.warn(`Failed to create and upload`, err)

      return false
    }
  }

  private async uploadDirectory(cacheDirectory: string, dir: string) {
    for (const entry of await promises.readdir(dir)) {
      const full = join(dir, entry)
      const stats = await promises.stat(full)

      if (stats.isDirectory()) {
        await this.uploadDirectory(cacheDirectory, full)
      } else if (stats.isFile()) {
        const destination = relative(cacheDirectory, full)
        this.uploadQueue.push(this.bucket.upload(full, { destination }))
      }
    }
  }
}
