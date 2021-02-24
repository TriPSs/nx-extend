import { JsonObject } from '@angular-devkit/core'

export interface FileReplacement {
  replace: string
  with: string
}

export interface BuildExecutorSchema extends JsonObject {
  main: string
  outputPath: string
  tsConfig: string
  fileReplacements: FileReplacement[]

  optimization?: boolean
  sourceMap?: boolean
  externalDependencies: 'all' | 'none' | string[]
  buildLibsFromSource?: boolean
  webpackConfig?: string

}
