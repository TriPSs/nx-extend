import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { getFriendlyRoleName } from '../naming'
import { BaseResource } from './base.resource'

export class IAMCustomRoleResource extends BaseResource {

  private readonly role: gcp.projects.IAMCustomRole

  constructor(
    private readonly roleId: string,
    private readonly args: Pick<gcp.projects.IAMCustomRoleArgs, 'title' | 'description' | 'permissions'>,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly iamOpts: pulumi.ComponentResourceOptions = {}
  ) {
    const friendlyRoleName = getFriendlyRoleName(null, roleId)

    super('iam-custom-role-resource', friendlyRoleName, {}, opts)

    this.role = new gcp.projects.IAMCustomRole(friendlyRoleName, {
      project: GCP_PROJECT_ID,
      roleId,
      ...args
    }, {
      ...iamOpts,
      parent: this
    })
  }

  public get name(): pulumi.Output<string> {
    return this.role.name
  }

  public create() {
    // Do nothing
  }

}
