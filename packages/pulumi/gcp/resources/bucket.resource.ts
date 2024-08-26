import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { buildName, getFriendlyRoleName } from '../naming'
import { BaseResource } from './base.resource'

export class BucketResource extends BaseResource {

  private readonly bucket: gcp.storage.Bucket

  constructor(
    private readonly bucketName: string,
    private readonly args: gcp.storage.BucketArgs,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly bucketOpts: pulumi.ComponentResourceOptions = {}
  ) {
    super('bucket-resource', bucketName, {}, opts)

    this.bucket = new gcp.storage.Bucket(bucketName, {
      project: GCP_PROJECT_ID,
      name: bucketName,
      ...args
    }, {
      ...bucketOpts,
      parent: this
    })
  }

  public addLegacyObjectReader(member: pulumi.Output<string>): BucketResource {
    this.addMember(member, 'roles/storage.legacyObjectReader')

    return this
  }

  public addLegacyObjectOwner(member: pulumi.Output<string>): BucketResource {
    this.addMember(member, 'roles/storage.legacyObjectOwner')

    return this
  }

  public addObjectAdmin(member: pulumi.Output<string>): BucketResource {
    this.addMember(member, 'roles/storage.objectAdmin')

    return this
  }

  public addObjectViewer(member: pulumi.Output<string>): BucketResource {
    this.addMember(member, 'roles/storage.objectViewer')

    return this
  }

  public addObjectCreator(member: pulumi.Output<string>): BucketResource {
    this.addMember(member, 'roles/storage.objectCreator')

    return this
  }

  public create(): void {
    // Do nothing
  }

  private addMember(member: pulumi.Output<string>, role: string): void {
    member.apply((parsedMember) => {
      this.createMember(parsedMember, role)
    })
  }

  private createMember(member: string, role: string, condition?: gcp.projects.IAMMemberArgs['condition']) {
    let memberName = member
    // When adding member of the same project, remove everything after the @ for shorter names
    if (memberName.includes(`@${GCP_PROJECT_ID}`)) {
      memberName = memberName.split('@').shift()
    }

    new gcp.storage.BucketIAMMember(buildName(this.bucketName, getFriendlyRoleName(memberName, role)), {
      bucket: this.bucket.name,
      member,
      role,
      condition
    }, {
      parent: this.bucket
    })
  }

}
