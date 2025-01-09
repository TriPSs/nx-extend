import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

import { GCP_PROJECT_ID } from '../config'
import { BaseResource } from './base.resource'

export type DNS_TYPE = 'A' | 'AAAA' | 'MX' | 'TXT' | 'CNAME'
export type DNS_VALUES = string | Array<string> | pulumi.Output<string>

export class DNSResource extends BaseResource {

  public static gmailSpfInclude = 'include:_spf.google.com'
  public static firebaseSpfInclude = 'include:_spf.firebasemail.com'

  public readonly zone: gcp.dns.ManagedZone

  private readonly friendlyDomain: string
  private emailDisabled = false

  constructor(
    private readonly domain: string,
    private readonly enableDnssec = true,
    private readonly opts: pulumi.ComponentResourceOptions = {},
    private readonly zoneOpts: pulumi.ComponentResourceOptions = {}
  ) {
    super('dns-resource', DNSResource.makeDomainFriendly(domain), {}, opts)

    this.friendlyDomain = DNSResource.makeDomainFriendly(domain)
    this.zone = new gcp.dns.ManagedZone(this.friendlyDomain, {
      name: this.friendlyDomain,
      dnsName: `${domain}.`,
      forceDestroy: false,
      visibility: 'public',
      dnssecConfig: {
        state: enableDnssec ? 'on' : 'off'
      }
    }, {
      ...zoneOpts,
      parent: this
    })
  }

  public static inQuotes(value: string): string[] {
    return value.match(/.{1,255}/g).map((value) => `"${value}"`)
  }

  public static createDKIM(key: string): string {
    return `v=DKIM1; k=rsa; p=${key};`
  }

  public static makeDomainFriendly(domain: string) {
    return domain.replace(/\./g, '-')
  }

  public createVercelRecords(): DNSResource {
    return this
      .createRecord('@', 'A', '76.76.21.21')
      .createRecord('www', 'CNAME', 'cname.vercel-dns.com.')
  }

  public createGmailMxRecords(): DNSResource {
    return this
      .createMxRecord(
        '@',
        '1 ASPMX.L.GOOGLE.COM.',
        '5 ALT1.ASPMX.L.GOOGLE.COM.',
        '5 ALT2.ASPMX.L.GOOGLE.COM.',
        '10 ALT3.ASPMX.L.GOOGLE.COM.',
        '10 ALT4.ASPMX.L.GOOGLE.COM.'
      )
  }

  public createWorkspaceShortcuts(): DNSResource {
    return this
      .createCNAMERecord('calendar', 'ghs.googlehosted.com.')
      .createCNAMERecord('drive', 'ghs.googlehosted.com.')
      .createCNAMERecord('groups', 'ghs.googlehosted.com.')
      .createCNAMERecord('mail', 'ghs.googlehosted.com.')
  }

  public disableEmail(...values: string[]): DNSResource {
    this.emailDisabled = true

    // Follows https://www.cloudflare.com/en-gb/learning/dns/dns-records/protect-domains-without-email/

    return this
      .createTXTRecord('@', 'v=spf1 -all', ...values)
      .createTXTRecord('*._domainkey', 'v=DKIM1; p=')
      .createTXTRecord('_dmarc', 'v=DMARC1;p=reject;adkim=s;aspf=s')
  }

  public createMxRecord(subDomain: string, ...value: string[]): DNSResource {
    if (this.emailDisabled) {
      throw new Error('Email is disabled!')
    }

    return this
      .createRecord(subDomain, 'MX', ...value)
  }

  /**
   * Creates an SPF records, possible adds other values to the TXT record
   */
  public createSpfRecord(subDomain: string, ips: string[], ...values: string[]): DNSResource {
    return this.createTXTRecord(subDomain, `v=spf1 ${ips.join(' ')} -all`, ...values)
  }

  public createDefaultDomainKeyRecord(subDomain = '_domainkey', value = '"o=~"'): DNSResource {
    return this.createRecord(subDomain, 'TXT', value)
  }

  public createDmarcRecord(subDomain = '_dmarc', mailTo?: string, adkim = 's', aspf = 's'): DNSResource {
    return this.createTXTRecord(subDomain, [
      'v=DMARC1',
      'p=reject',
      'pct=100',
      mailTo && `rua=mailto:${mailTo}@${this.domain}`,
      adkim && `adkim=${adkim}`,
      aspf && `aspf=${aspf}`
    ].filter(Boolean).join(';'))
  }

  public createTXTRecord(subDomain: string, ...values: string[]): DNSResource {
    return this.createRecord(subDomain, 'TXT', ...values.map((value) => DNSResource.inQuotes(value).join(' ')))
  }

  public createCNAMERecord(subDomain: string, ...values: DNS_VALUES[]): DNSResource {
    return this.createRecord(subDomain, 'CNAME', ...values)
  }

  public createARecord(subDomain: string, ...values: DNS_VALUES[]): DNSResource {
    return this.createRecord(subDomain, 'A', ...values)
  }

  public createAAAARecord(subDomain: string, ...values: DNS_VALUES[]): DNSResource {
    return this.createRecord(subDomain, 'AAAA', ...values)
  }

  public createRecord(subDomain: string, type: DNS_TYPE, ...values: DNS_VALUES[]): DNSResource {
    new gcp.dns.RecordSet(this.resourceName(subDomain, type), {
      project: GCP_PROJECT_ID,
      managedZone: this.zone.name,
      name: this.recordName(subDomain),
      ttl: 3600,
      type,
      rrdatas: values.flatMap((value) => value)
    }, {
      deleteBeforeReplace: true,
      parent: this.zone,
      protect: false
    })

    return this
  }

  public create(): void {
    // Do nothing
  }

  private resourceName(subDomain: string, type: DNS_TYPE): string {
    const resourceName = `${this.friendlyDomain}-${type.toLowerCase()}`

    if (subDomain !== '@') {
      return `${DNSResource.makeDomainFriendly(subDomain)}-${resourceName}`
    }

    return resourceName
  }

  private recordName(subDomain: string): pulumi.Output<string> {
    if (subDomain !== '@') {
      return pulumi.interpolate`${subDomain}.${this.zone.dnsName}`
    }

    return this.zone.dnsName
  }
}
