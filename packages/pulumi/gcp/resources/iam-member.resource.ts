import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { getFriendlyMemberName, getFriendlyName } from '../naming'
import { BaseResource } from './base.resource'

export class IAMMemberResource extends BaseResource {

  constructor(
    private readonly member: string,
    opts: pulumi.ComponentResourceOptions = {}
  ) {
    super('iam-member-resource', getFriendlyMemberName(member), {}, opts)
  }

  public addRole(
    role: string,
    condition?: gcp.projects.IAMMemberArgs['condition'],
    opts: pulumi.ComponentResourceOptions = {}
  ) {
    new gcp.projects.IAMMember(getFriendlyName(role), {
      project: GCP_PROJECT_ID,
      member: this.member,
      role,
      condition
    }, {
      ...opts,
      parent: this
    })

    return this
  }

  public create() {
    // Do nothing
  }
}
