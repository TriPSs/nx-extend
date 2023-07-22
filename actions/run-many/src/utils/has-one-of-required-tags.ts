function doesTagMatchOneOfTheConditions(conditions: string[], tag: string) {
  return conditions.some((condition) => {
    if (condition.includes('=') && tag.includes('=')) {
      let matcher = (conditionValue, tagValue) => conditionValue.trim() === tagValue.trim()
      let splitOn = '='

      if (condition.includes('!=')) {
        matcher = (conditionValue, tagValue) => conditionValue.trim() !== tagValue.trim()
        splitOn = '!='
      }

      const [conditionKey, conditionValue] = condition.split(splitOn)
      const [key, value] = tag.split('=')

      if (conditionKey !== key) {
        return false
      }

      return matcher(conditionValue, value)
    } else {
      return condition === tag
    }
  })
}

export function hasOneOfRequiredTags(tags?: string[], requiresOnOfTheseTagConditions?: string[]): boolean {
  if (!requiresOnOfTheseTagConditions || requiresOnOfTheseTagConditions.length === 0) {
    return true
  }

  if (!tags || tags.length === 0) {
    return false
  }

  return tags.some((tag) => doesTagMatchOneOfTheConditions(requiresOnOfTheseTagConditions, tag))
}
