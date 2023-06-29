export function hasOneOfRequiredTags(tags?: string[], requiresOneOfTheseTags?: string[]): boolean {
  if (!requiresOneOfTheseTags || requiresOneOfTheseTags.length === 0) {
    return true
  }

  if (!tags || tags.length === 0) {
    return false
  }

  return tags.some((tag) => requiresOneOfTheseTags.includes(tag))
}
