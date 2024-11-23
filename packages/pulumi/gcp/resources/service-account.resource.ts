import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { buildName, getFriendlyRoleName } from '../naming'
import { BaseResource } from './base.resource'

export class ServiceAccountResource extends BaseResource {

  private readonly account: gcp.serviceaccount.Account

  constructor(
    private readonly accountId: string,
    private readonly displayName?: string,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly serviceAccountOtps: pulumi.ComponentResourceOptions = {}
  ) {
    super('service-account-resource', accountId, {}, opts)

    this.account = new gcp.serviceaccount.Account(accountId, {
      project: GCP_PROJECT_ID,
      accountId,
      displayName
    }, {
      ...serviceAccountOtps,
      parent: this,
      deleteBeforeReplace: true
    })
  }

  public get id(): pulumi.Output<string> {
    return this.account.id
  }

  public get member(): pulumi.Output<string> {
    return this.account.member
  }

  public get email(): pulumi.Output<string> {
    return this.account.email
  }

  public addCustomRole(role: pulumi.Output<string>, condition?: gcp.projects.IAMMemberArgs['condition']): ServiceAccountResource {
    role.apply((parsedRole) => {
      this.addRole(parsedRole, condition)
    })

    return this
  }

  public addRole(role: string, condition?: gcp.projects.IAMMemberArgs['condition']): ServiceAccountResource {
    new gcp.projects.IAMMember(getFriendlyRoleName(this.accountId, role), {
      project: GCP_PROJECT_ID,
      member: this.account.member,
      role,
      condition
    }, {
      parent: this.account,
      protect: false
    })

    return this
  }

  public addCloudRunRole(
    { service, location }: { service: string, location: string },
    role: string
  ): ServiceAccountResource {
    new gcp.cloudrun.IamMember(buildName(service, getFriendlyRoleName(this.accountId, role)), {
      project: GCP_PROJECT_ID,
      member: this.account.member,
      service,
      location,
      role
    }, {
      parent: this.account,
      protect: false
    })

    return this
  }

  public create(): void {
    // Do nothing
  }

}
