import { JsonObject } from '@angular-devkit/core'

export interface DeployExecutorSchema extends JsonObject {

  functionName: string

  runtime?: string

  entryPoint?: string

  serviceAccount?: string

  memory?: string

  region: string

  envVarsFile?: string

  allowUnauthenticated?: boolean

  maxInstances?: number

  trigger: string

  triggerValue?: string

  project?: string

  retry?: boolean

}
