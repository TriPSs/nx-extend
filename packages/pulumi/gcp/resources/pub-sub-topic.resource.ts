import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { buildName, getFriendlyName, getFriendlyRoleName } from '../naming'

export class PubSubTopicResource extends pulumi.ComponentResource {

  private readonly topic: gcp.pubsub.Topic

  constructor(
    private readonly topicName: string,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly topicOpts: pulumi.ComponentResourceOptions = {}
  ) {
    super('pub-sub-topic-resource', getFriendlyName(topicName), {}, opts)

    this.topic = new gcp.pubsub.Topic(getFriendlyName(this.topicName), {
      name: this.topicName,
      project: GCP_PROJECT_ID
    }, {
      ...topicOpts,
      parent: this
    })
  }

  public addServiceAccount(member: string, role: string): PubSubTopicResource {
    this.createMember(
      `serviceAccount:${member}@${GCP_PROJECT_ID}.iam.gserviceaccount.com`,
      role
    )
    return this
  }

  public addMember(member: pulumi.Output<string>, role: string): PubSubTopicResource {
    member.apply((parsedMember) => {
      this.createMember(parsedMember, role)
    })

    return this
  }

  public create() {
    // Do nothing
  }

  private createMember(member: string, role: string, condition?: gcp.projects.IAMMemberArgs['condition']) {
    let memberName = member
    // When adding member of the same project, remove everything after the @ for shorter names
    if (memberName.includes(`@${GCP_PROJECT_ID}`)) {
      memberName = memberName.split('@').shift()
    }

    new gcp.pubsub.TopicIAMMember(buildName(this.topicName, getFriendlyRoleName(memberName, role)), {
      project: GCP_PROJECT_ID,
      topic: this.topic.name,
      member,
      role,
      condition
    }, {
      parent: this.topic
    })
  }

}
