import { JsonObject } from '@angular-devkit/core'

export interface ExtractSchema extends JsonObject {

  sourceRoot?: string

  pattern?: string

  defaultLanguage: string

  languages: string[]

  output?: string

  format?: string

}
