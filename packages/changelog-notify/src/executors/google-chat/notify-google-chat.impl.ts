import axios from 'axios'

import type { NotifyChangelogOptions, Section } from '../../shared/options'

import { getIssueUrl } from '../../shared/get-issue-url'
import { getSections } from '../../shared/get-sections'

const { GOOGLE_CHAT_CHANGELOG_WEBHOOK } = process.env

export function formatSection(options: NotifyChangelogOptions, section: Section) {
  return {
    header: `${section.header}`,
    widgets: section.lines.map(({ line, ticket }) => ({
      keyValue: {
        content: line.replace('* ', '')
          .replace(':**', ':</b>')
          .replace('**', '<b>')
          .split('([')
          .shift()
          .trim(),
        bottomLabel: ticket && `<b>Ticket:</b> ${ticket.number}`,
        contentMultiline: true,
        onClick: ticket
          ? {
            openLink: {
              url: getIssueUrl(options, ticket)
            }
          }
          : undefined
      }
    }))
  }
}

export default async function notifyChangelog(options: NotifyChangelogOptions) {
  if (!GOOGLE_CHAT_CHANGELOG_WEBHOOK) {
    throw new Error('No "SLACK_CHANGELOG_WEBHOOK" environment variable set!')
  }

  return {
    success: await axios.post(GOOGLE_CHAT_CHANGELOG_WEBHOOK, {
      cards: [{
        header: {
          title: options.tag || 'v0.0.0'
        },
        sections: getSections(options).map((section) => formatSection(options, section))
      }]
    })
  }
}
