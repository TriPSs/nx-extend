import { BuilderContext } from '@angular-devkit/architect'
import { join } from 'path'

export type Extractors = 'formatjs' | 'react-intl'

export interface ExtractSettings {

  defaultLocale: string

  outputDirectory?: string

  extractor?: Extractors

}

export default abstract class BaseProvider<Config extends ExtractSettings> {

  protected readonly context: BuilderContext

  protected projectRoot: string = null

  protected projectMetadata = null

  protected config: Config = null

  protected sourceFile: string = null

  constructor(context: BuilderContext) {
    this.context = context
  }

  public async init(): Promise<void> {
    await this.setProjectRoot()

    this.config = await this.getConfigFile()

    this.sourceFile = join(this.config.outputDirectory, `${this.config.defaultLocale}.json`)
  }

  public abstract getExtractSettings(): ExtractSettings

  public abstract pull(): Promise<void>

  public abstract push(): Promise<void>

  public abstract translate(): Promise<void>

  public abstract getConfigFile(): Promise<Config>

  protected async setProjectRoot(): Promise<void> {
    if (this.projectRoot === null) {
      const projectMetadata = await this.context.getProjectMetadata(this.context.target.project)
      this.projectRoot = join(`${this.context.workspaceRoot}`, `${projectMetadata.root}`)
    }
  }

}
