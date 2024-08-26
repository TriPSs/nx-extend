import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { getFriendlyRoleName } from '../naming'
import { BaseResource } from './base.resource'

export class IAMBindingResource extends BaseResource {

  private readonly friendlyRoleName: string
  private members: pulumi.Input<string>[] = []

  constructor(
    private readonly role: string,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly iamOpts: pulumi.ComponentResourceOptions = {}
  ) {
    const friendlyRoleName = getFriendlyRoleName(null, role)

    super('iam-binding-resource', friendlyRoleName, {}, opts)

    this.friendlyRoleName = friendlyRoleName
  }

  public addServiceAccount(member: string): IAMBindingResource {
    this.members.push(`serviceAccount:${member}@${GCP_PROJECT_ID}.iam.gserviceaccount.com`)

    return this
  }

  public addMember(member: pulumi.Input<string>): IAMBindingResource {
    this.members.push(member)

    return this
  }

  public create() {
    new gcp.projects.IAMBinding(this.friendlyRoleName, {
      project: GCP_PROJECT_ID,
      role: this.role,
      members: this.members
    }, {
      ...this.iamOpts,
      parent: this
    })
  }

}
