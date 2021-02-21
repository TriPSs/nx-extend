import { JsonObject } from '@angular-devkit/core'

export interface ExecutorSchema extends JsonObject {

  file: string

  project?: string

}
