import { NotifyChangelogOptions } from './options'

export interface TicketInfo {
  number: string
  repo?: string
}

export const getTicketNrFromLine = (options: NotifyChangelogOptions, line: string): TicketInfo | undefined => {
  const matches = new RegExp(/closes \[(?<repo>.*?)#(?<ticketNr>[0-9]+)\]/g)
    .exec(line)

  if (matches && matches.groups && matches.groups.ticketNr) {
    return {
      repo: matches.groups.repo,
      number: matches.groups.ticketNr
    }
  }

  return undefined
}