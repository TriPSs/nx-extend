import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { buildName, getFriendlyMemberName, getFriendlyRoleName } from '../naming'
import { BaseResource } from './base.resource'

export class QueueResource extends BaseResource {

  private readonly queue: gcp.cloudtasks.Queue

  constructor(
    private readonly queueName: string,
    private readonly args: Pick<gcp.cloudtasks.QueueArgs, 'location'> & Partial<Omit<gcp.cloudtasks.QueueArgs, 'location'>>,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly queueOpts: pulumi.ComponentResourceOptions = {}
  ) {
    super('queue-resource', queueName, {}, opts)

    this.queue = new gcp.cloudtasks.Queue(queueName, {
      name: queueName,
      project: GCP_PROJECT_ID,
      ...args
    }, {
      ...queueOpts,
      parent: this
    })
  }

  public create(): void {
    // Do nothing
  }

  public addEnqueuer(member: pulumi.Output<string>): QueueResource {
    return this.addMember(member, 'roles/cloudtasks.enqueuer')
  }

  public addMember(member: pulumi.Output<string>, role: string): QueueResource {
    member.apply((parsedMember) => {
      this.createMember(parsedMember, role)
    })

    return this
  }

  private createMember(member: string, role: string, condition?: gcp.projects.IAMMemberArgs['condition']) {
    new gcp.cloudtasks.QueueIamMember(buildName(this.queueName, getFriendlyRoleName(getFriendlyMemberName(member), role)), {
      name: this.queue.name,
      location: this.queue.location,

      role,
      member,
      condition
    }, {
      parent: this.queue,
      deleteBeforeReplace: true
    })

    return this
  }
}
