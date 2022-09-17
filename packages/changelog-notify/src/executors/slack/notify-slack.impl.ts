import axios from 'axios'

import type { NotifyChangelogOptions } from '../../shared/options'

import { getIssueUrl } from '../../shared/get-issue-url'
import { getSections } from '../../shared/get-sections'
import { Section } from '../../shared/options'

export interface NotifySlackOptions extends NotifyChangelogOptions {
  username?: string
  iconEmoji?: string
  iconUrl?: string
}

const { SLACK_CHANGELOG_WEBHOOK } = process.env

export function formatSection(options: NotifySlackOptions, section: Section) {
  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: section.header
      }
    },
    ...section.lines.map(({ line, ticket }) => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: line.replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
          .replace('* **', '*')
          .replace(':**', ':*')
      },
      ...(ticket && ({
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: `#${ticket.number}`
          },
          url: getIssueUrl(options, ticket)
        }
      }))
    }))
  ]
}

export default async function notifyChangelog(options: NotifySlackOptions) {
  if (!SLACK_CHANGELOG_WEBHOOK) {
    throw new Error('No "SLACK_CHANGELOG_WEBHOOK" environment variable set!')
  }

  const sections = getSections(options).map((section) => formatSection(options, section))

  return {
    success: await axios.post(SLACK_CHANGELOG_WEBHOOK, {
      username: options.username || 'Release BOT',
      icon_emoji: options.iconEmoji,
      icon_url: options.iconUrl,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Changelog for *${options.tag || 'v0.0.0'}*`
          }
        },
        ...sections.reduce((blocks, section) => {
          return blocks.concat(section)
        }, [])
      ]
    })
  }
}
