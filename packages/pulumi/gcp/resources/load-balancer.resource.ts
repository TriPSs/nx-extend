import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { BaseResource } from './base.resource'
import { DNSResource } from './dns.resource'

type Backends = gcp.compute.BackendBucket | gcp.compute.BackendService

export class LoadBalancerResource extends BaseResource {

  public readonly ipv4Address: gcp.compute.GlobalAddress = new gcp.compute.GlobalAddress(this.buildName('ipv4'), {
    project: GCP_PROJECT_ID,
    name: this.buildName('ipv4'),
    ipVersion: 'IPV4',
    addressType: 'EXTERNAL'
  }, {
    parent: this
  })

  public readonly ipv6Address: gcp.compute.GlobalAddress = new gcp.compute.GlobalAddress(this.buildName('ipv6'), {
    project: GCP_PROJECT_ID,
    name: this.buildName('ipv6'),
    ipVersion: 'IPV6',
    addressType: 'EXTERNAL'
  }, {
    parent: this
  })

  private sslCertificateDomains: string[] = []
  private backends: Map<string, Backends> = new Map()

  private rules: Array<{ backendName: string, domain: string }> = []

  constructor(
    private readonly name: string,
    private readonly opts: pulumi.ComponentResourceOptions = {}
  ) {
    super('load-balancer-resource', name, {}, opts)
  }

  public addSsl(domain: string) {
    this.sslCertificateDomains.push(domain)

    return this
  }

  public addBackend(type: 'bucket', options: gcp.compute.BackendBucketArgs): this
  public addBackend(type: 'service', options: gcp.compute.BackendServiceArgs): this
  public addBackend(type: 'bucket' | 'service', options: gcp.compute.BackendBucketArgs | gcp.compute.BackendServiceArgs) {
    if (!options.name) {
      throw new Error('"name" is required for backends!')
    }

    if (type === 'bucket') {
      this.backends.set(
        options.name as never as string,
        new gcp.compute.BackendBucket(
          options.name as never as string,
          options as gcp.compute.BackendBucketArgs,
          { parent: this }
        )
      )

    } else if (type === 'service') {
      this.backends.set(
        options.name as never as string,
        new gcp.compute.BackendService(
          options.name as never as string,
          options as gcp.compute.BackendServiceArgs,
          { parent: this }
        )
      )
    }

    return this
  }

  public addRules(rules: Array<{ backendName: string, domain: string }>): this {
    this.rules = rules

    return this
  }

  public create() {
    if (this.rules.length === 0) {
      throw new Error('No rules defined!')
    }

    const hostRules = this.rules.map(({ domain }) => ({
      hosts: [domain],
      pathMatcher: DNSResource.makeDomainFriendly(domain)
    }))

    const pathMatchers = this.rules.map(({ domain, backendName }) => ({
      // Link it to the backend
      defaultService: this.backends.get(backendName).selfLink,
      // Link to hostRule
      name: DNSResource.makeDomainFriendly(domain)
    }))

    const urlMap = new gcp.compute.URLMap(this.buildName(), {
      project: GCP_PROJECT_ID,
      name: this.buildName(),
      hostRules,
      pathMatchers,
      defaultService: pathMatchers[0].defaultService
    }, {
      parent: this
    })

    const sslCertificatesSelfLinks = this.sslCertificateDomains.map((domain) => {
      const friendlyDomain = DNSResource.makeDomainFriendly(domain)

      return new gcp.compute.ManagedSslCertificate(`${friendlyDomain}-ssl`, {
        project: GCP_PROJECT_ID,
        name: `${friendlyDomain}-ssl`,
        managed: {
          domains: [domain]
        }
      }, {
        parent: urlMap
      }).selfLink
    })

    const targetProxyName = this.buildName('target-proxy')
    const loadBalancerTargetProxy = new gcp.compute.TargetHttpsProxy(targetProxyName, {
      project: GCP_PROJECT_ID,
      name: targetProxyName,
      sslCertificates: sslCertificatesSelfLinks,
      urlMap: urlMap.selfLink
    }, {
      parent: urlMap
    })

    const globalForwardingRuleIpv4Name = this.buildName('forwarding-rule-ipv4')
    new gcp.compute.GlobalForwardingRule(globalForwardingRuleIpv4Name, {
      project: GCP_PROJECT_ID,
      name: globalForwardingRuleIpv4Name,
      loadBalancingScheme: 'EXTERNAL_MANAGED',
      portRange: '443',
      target: loadBalancerTargetProxy.selfLink,
      ipAddress: this.ipv4Address.selfLink,
      ipProtocol: 'TCP'
    }, {
      parent: loadBalancerTargetProxy
    })

    const globalForwardingRuleIpv6Name = this.buildName('forwarding-rule-ipv6')
    new gcp.compute.GlobalForwardingRule(globalForwardingRuleIpv6Name, {
      project: GCP_PROJECT_ID,
      name: globalForwardingRuleIpv6Name,
      loadBalancingScheme: 'EXTERNAL_MANAGED',
      portRange: '443',
      target: loadBalancerTargetProxy.selfLink,
      ipAddress: this.ipv6Address.selfLink,
      ipProtocol: 'TCP'
    }, {
      parent: loadBalancerTargetProxy
    })

    return this
  }

  public withHttpHttpsRedirect() {
    const urlMapName = this.buildName('http-https')
    const urlMap = new gcp.compute.URLMap(urlMapName, {
      project: GCP_PROJECT_ID,
      name: urlMapName,
      defaultUrlRedirect: {
        httpsRedirect: true,
        redirectResponseCode: 'MOVED_PERMANENTLY_DEFAULT',
        stripQuery: false
      }
    }, {
      parent: this
    })

    const targetProxyName = this.buildName('http-https-target-proxy')
    const targetProxy = new gcp.compute.TargetHttpProxy(targetProxyName, {
      project: GCP_PROJECT_ID,
      name: targetProxyName,
      urlMap: urlMap.selfLink
    }, {
      parent: urlMap
    })

    const globalForwardingRuleIpv4Name = this.buildName('http-https-forwarding-rule-ipv4')
    new gcp.compute.GlobalForwardingRule(globalForwardingRuleIpv4Name, {
      project: GCP_PROJECT_ID,
      name: globalForwardingRuleIpv4Name,
      loadBalancingScheme: 'EXTERNAL_MANAGED',
      portRange: '80',
      target: targetProxy.selfLink,
      ipAddress: this.ipv4Address.selfLink
    }, {
      parent: targetProxy
    })

    const globalForwardingRuleIpv6Name = this.buildName('http-https-forwarding-rule-ipv6')
    new gcp.compute.GlobalForwardingRule(globalForwardingRuleIpv6Name, {
      project: GCP_PROJECT_ID,
      name: globalForwardingRuleIpv6Name,
      loadBalancingScheme: 'EXTERNAL_MANAGED',
      portRange: '80',
      target: targetProxy.selfLink,
      ipAddress: this.ipv6Address.selfLink
    }, {
      parent: targetProxy
    })

    return this
  }

  private buildName(type?: string): string {
    return `${this.name}-load-balancer${type ? `-${type}` : ''}`
  }

}
