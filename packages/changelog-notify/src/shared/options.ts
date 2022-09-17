import type { TicketInfo } from './get-ticket-nr-from-line'

export interface NotifyChangelogOptions {
  issueRepo?: string
  tag: string
  notes: string
}

export interface Section {
  header: string
  lines: { line: string, ticket?: TicketInfo }[]
}
