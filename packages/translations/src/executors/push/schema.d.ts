import { JsonObject } from '@angular-devkit/core'

export interface PushSchema extends JsonObject {

  provider: string

  language?: string

}
