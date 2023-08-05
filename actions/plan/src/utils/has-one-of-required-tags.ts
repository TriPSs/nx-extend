import * as core from '@actions/core'

function hasTagMatchingCondition(condition: string, tags: string[]): boolean {
  if (condition.includes('=')) {
    // If it includes a "," it's a AND condition
    if (condition.includes(',')) {
      const subConditions = condition.split(',').map((subCondition) => subCondition.trim())

      // It should match all the conditions
      return subConditions.every((subCondition) => {
        return hasTagMatchingCondition(subCondition, tags)
      })
    }

    if (condition.includes('!=')) {
      const [conditionKey, conditionValue] = condition.split('!=')

      const useTags = tags.filter((tag) => tag.startsWith(`${conditionKey}=`))

      // If the project does not have any tags with the condition key it's allowed
      if (useTags.length === 0) {
        return true
      }

      return useTags.some((tag) => {
        return tag.split('=').pop().trim() !== conditionValue.trim()
      }, [])

    } else {
      const [conditionKey, conditionValue] = condition.split('=')

      return tags.some((tag) => {
        const [key, value] = tag.split('=')

        if (conditionKey !== key) {
          return false
        }

        return conditionValue.trim() === value.trim()
      })
    }

  } else {
    return tags.some((tag) => tag === condition)
  }
}

export function cleanLogConditions(conditions: string[]) {
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
