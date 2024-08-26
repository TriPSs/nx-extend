import * as pulumi from '@pulumi/pulumi'

export abstract class BaseResource extends pulumi.ComponentResource {

  public abstract create(): void

}
