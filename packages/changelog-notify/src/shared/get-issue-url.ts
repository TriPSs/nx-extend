import type { TicketInfo } from './get-ticket-nr-from-line'
import type { NotifyChangelogOptions } from './options'

export const getIssueUrl = (options: NotifyChangelogOptions, ticket: TicketInfo) => {
  if (!options.issueRepo && !ticket.repo) {
    return undefined
  }

  return `https://github.com/${ticket.repo || options.issueRepo}/issues/${ticket.number}`
}
