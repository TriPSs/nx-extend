import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { iamRoles } from '../iam-roles'
import { buildName, getFriendlyMemberName, getFriendlyRoleName } from '../naming'
import { BaseResource } from './base.resource'

const secretsConfig = new pulumi.Config('gcpR-secrets')

/**
 * When adding secrets, make sure they are added to the namespace "gcpR-secrets"
 */
export class SecretResource extends BaseResource {

  private readonly secret: gcp.secretmanager.Secret

  constructor(
    private readonly secretName: string,
    private readonly args: Partial<gcp.secretmanager.SecretArgs> = {},
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly secretOpts: pulumi.ComponentResourceOptions = {}
  ) {
    super('secret-resource', secretName, {}, opts)

    this.secret = new gcp.secretmanager.Secret(secretName, {
      replication: {
        auto: {}
      },
      project: GCP_PROJECT_ID,
      secretId: secretName,
      ...args
    }, {
      ...secretOpts,
      parent: this
    })
  }

  public create(isObject?: boolean) {
    const secret = isObject
      ? secretsConfig.requireSecretObject(this.secretName)
      : secretsConfig.requireSecret(this.secretName)

    secret.apply((secretValue) => {
      new gcp.secretmanager.SecretVersion(buildName(this.secretName, 'secret-version'), {
        secret: this.secret.id,
        secretData: typeof secretValue === 'string' ? secretValue : JSON.stringify(secretValue)
      }, {
        parent: this.secret,
        aliases: [{ parent: pulumi.rootStackResource }]
      })
    })
  }

  public addAccessor(member: pulumi.Output<string>): SecretResource {
    return this.addMember(member, iamRoles.secretmanager.secretAccessor)
  }

  public addMember(member: pulumi.Output<string>, role: string): SecretResource {
    member.apply((parsedMember) => {
      this.createMember(parsedMember, role)
    })

    return this
  }

  private createMember(member: string, role: string, condition?: gcp.projects.IAMMemberArgs['condition']) {
    new gcp.secretmanager.SecretIamMember(buildName(this.secretName, getFriendlyRoleName(getFriendlyMemberName(member), role)), {
      secretId: this.secret.id,
      role,
      member,
      condition
    }, {
      parent: this.secret,
      deleteBeforeReplace: true
    })

    return this
  }
}
