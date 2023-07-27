import * as core from '@actions/core'

function hasTagMatchingCondition(condition: string, tags: string[]): boolean {
  if (condition.includes('=')) {
    // If it includes a "," it's a AND condition
    if (condition.includes(',')) {
      const subConditions = condition.split(',').map((subCondition) => subCondition.trim())

      // It should match all the conditions
      return subConditions.every((subCondition) => hasTagMatchingCondition(subCondition, tags))
    }

    let matcher = (conditionValue: string, tagValue: string): boolean => conditionValue.trim() === tagValue.trim()
    let splitOn = '='

    if (condition.includes('!=')) {
      matcher = (conditionValue: string, tagValue: string): boolean => conditionValue.trim() !== tagValue.trim()
      splitOn = '!='
    }

    const [conditionKey, conditionValue] = condition.split(splitOn)

    return tags.some((tag) => {
      const [key, value] = tag.split('=')

      if (conditionKey !== key) {
        return false
      }

      return matcher(conditionValue, value)
    })

  } else {
    return tags.some((tag) => tag === condition)
  }
}

function cleanLogConditions(conditions: string[]) {
  return conditions.map((condition) => {
    if (condition.includes(',')) {
      return condition.split(',').map((subCondition) => subCondition.trim())
        .join(' AND ')
    }

    return condition
  }).join(' OR ')
}

export function hasOneOfRequiredTags(projectName: string, tags?: string[], requiresOnOfTheseTagConditions?: string[]): boolean {
  if (!requiresOnOfTheseTagConditions || requiresOnOfTheseTagConditions.length === 0) {
    return true
  }

  if (!tags || tags.length === 0) {
    return false
  }

  const hasMatch = requiresOnOfTheseTagConditions.some((condition) => hasTagMatchingCondition(condition, tags))

  if (!hasMatch) {
    core.debug(`[${projectName}]: Does not match any of the provided condition "${cleanLogConditions(requiresOnOfTheseTagConditions)}"`)
  }

  return hasMatch
}
