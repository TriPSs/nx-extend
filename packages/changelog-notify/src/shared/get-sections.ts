import { getTicketNrFromLine } from './get-ticket-nr-from-line'
import { NotifyChangelogOptions, Section } from './options'

export const getSections = (options: NotifyChangelogOptions): Section[] => {
  const sections = [] as Section[]
  let activeSection: Section

  options.notes.split('\n')
    .forEach((line) => {
      if (line.startsWith('###')) {
        // We had an active cart, add it to cards
        if (activeSection) {
          sections.push(activeSection)
        }

        activeSection = {
          header: line.replace('###', '').trim(),
          lines: []
        }
      } else if (activeSection && line.trim().length > 0) {
        activeSection.lines.push({
          line,
          ticket: getTicketNrFromLine(options, line)
        })
      }
    })

  // If we have a active section add it
  if (activeSection) {
    sections.push(activeSection)
  }

  return sections
}
