export interface ExtractSettings {

  defaultLocale: string

  languages: string[]

}

export default abstract class BaseProvider {

  abstract getExtractSettings(projectRoot: string): ExtractSettings

}
