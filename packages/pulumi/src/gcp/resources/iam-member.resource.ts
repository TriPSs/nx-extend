import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { getFriendlyRoleName } from '../naming'

export class IAMMemberResource extends pulumi.ComponentResource {

  constructor(
    private readonly member: string,
    private readonly role: string,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly iamOpts: pulumi.ComponentResourceOptions = {}
  ) {
    super('iam-member-resource', getFriendlyRoleName(member, role), {}, opts)
  }

  public create(condition?: gcp.projects.IAMMemberArgs['condition']) {
    new gcp.projects.IAMMember(getFriendlyRoleName(this.member, this.role), {
      project: GCP_PROJECT_ID,
      member: this.member,
      role: this.role,
      condition
    }, {
      ...this.iamOpts,
      parent: this
    })
  }

}
