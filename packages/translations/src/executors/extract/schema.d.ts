import { JsonObject } from '@angular-devkit/core'

export interface ExtractSchema extends JsonObject {

  provider?: string

  sourceRoot?: string

  pattern?: string

  defaultLanguage?: string

  languages?: string[]

  output?: string

  format?: string

  extractor?: 'formatjs' | 'react-intl'

}
