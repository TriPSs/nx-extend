import { BuilderContext } from '@angular-devkit/architect'
import { join } from 'path'

export interface ExtractSettings {

  defaultLocale: string

  languages: string[]

}

export default abstract class BaseProvider<Config = {}> {

  protected readonly context: BuilderContext

  protected projectRoot: string = null

  protected config: Config = null

  constructor(context: BuilderContext) {
    this.context = context
  }

  public async init(): Promise<void> {
    await this.setProjectRoot()

    this.config = await this.getConfigFile()
  }

  public abstract getExtractSettings(projectRoot: string): ExtractSettings

  public abstract pull(): Promise<void>

  public abstract push(): Promise<void>

  public abstract getConfigFile(): Promise<Config>

  protected async setProjectRoot(): Promise<void> {
    if (this.projectRoot === null) {
      const projectMetadata = await this.context.getProjectMetadata(this.context.target.project)
      this.projectRoot = join(`${this.context.workspaceRoot}`, `${projectMetadata.root}`)
    }
  }

}
