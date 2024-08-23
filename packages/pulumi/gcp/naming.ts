import { GCP_PROJECT_ID } from './config'

export function buildName(...parts: string[]): string {
  return parts.filter(Boolean).join('::')
}

export function getFriendlyRoleName(prefix: string, role: string): string {
  return [
    prefix,
    getFriendlyName(role)
  ].filter(Boolean).join('-')
}

export function getFriendlyName(name: string): string {
  return name
    .replace(/\./g, '-')
    .replace(/\//g, '-')
}

export function getFriendlyMemberName(member: string): string {
  let memberName = member
  // When adding member of the same project, remove everything after the @ for shorter names
  if (memberName.includes(`@${GCP_PROJECT_ID}`)) {
    memberName = memberName.split('@').shift()
  }

  return memberName
}
