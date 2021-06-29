import { JsonObject } from '@angular-devkit/core'

export interface ExecutorSchema extends JsonObject {

  /**
   * Default is app prefix
   */
  name?: string

  dockerFile: string

  project: string

  tag?: string

  http2?: boolean

  region: string

  allowUnauthenticated?: boolean

  envVars?: {
    [key: string]: string
  }

  concurrency?: number

  maxInstances?: number

  minInstances?: number

  memory?: string

  cloudSqlInstance?: string

  logsDir?: string

}
