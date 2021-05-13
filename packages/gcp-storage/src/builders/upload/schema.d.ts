import { JsonObject } from '@angular-devkit/core'

export interface UploadExecutorSchema extends JsonObject {

  bucket: string

  directory: string

  gzip: boolean

}
