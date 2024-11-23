import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { BaseResource } from './base.resource'

export class BackendServiceBackendsResource extends BaseResource {

  private cloudRun: gcp.types.input.compute.RegionNetworkEndpointGroupCloudRun
  private cloudFunction: gcp.types.input.compute.RegionNetworkEndpointGroupCloudFunction

  private regions: string[] = []

  constructor(
    private readonly name: string,
    private readonly opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('backend-service-backends-resource', name, {}, opts)
  }

  public forCloudRun(cloudRun: gcp.types.input.compute.RegionNetworkEndpointGroupCloudRun): Pick<this, 'addRegion'> {
    this.cloudRun = cloudRun

    return this
  }

  public forCloudFunction(cloudFunction: gcp.types.input.compute.RegionNetworkEndpointGroupCloudFunction): Pick<this, 'addRegion'> {
    this.cloudFunction = cloudFunction

    return this
  }

  public addRegion(region: string): Pick<this, 'addRegion' | 'create'> {
    this.regions.push(region)

    return this
  }

  public create(backendServiceBackend?: Partial<gcp.types.input.compute.BackendServiceBackend>): gcp.types.input.compute.BackendServiceBackend[] {
    return this.regions.map((region) => {
      const name = this.getNegName(region)

      const neg = new gcp.compute.RegionNetworkEndpointGroup(name, {
        project: GCP_PROJECT_ID,
        name,
        networkEndpointType: 'SERVERLESS',
        region,
        cloudRun: this.cloudRun,
        cloudFunction: this.cloudFunction,
      }, {
        parent: this
      })

      return {
        balancingMode: 'UTILIZATION',
        ...backendServiceBackend,
        group: neg.selfLink
      }
    })
  }

  private getNegName(region: string): string {
    return `${this.name}-neg-${region}`
  }
}
