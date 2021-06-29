import * as shell from 'shelljs'
import * as conventionalRecommendedBump from 'conventional-recommended-bump'

import { ChangelogOptions } from './changelog'

export const bumpVersion = async (options: ChangelogOptions, version: string) => {
  return new Promise((resolve, reject) => {
    conventionalRecommendedBump({
      preset: options.preset,
      tagPrefix: options.tagPrefix
    }, async (error, recommendation) => {
      if (recommendation) {
        shell.echo(`Recommended bump "${recommendation.releaseType}", reason: ${recommendation.reason}`)

        let major: number | string,
          minor: number | string,
          patch: number | string

        [major, minor, patch] = version.split('.')

        switch (recommendation.releaseType) {
          case 'major':
            major = parseInt(major, 10) + 1
            minor = 0
            patch = 0
            break

          case 'minor':
            minor = parseInt(minor, 10) + 1
            patch = 0
            break

          default:
            patch = parseInt(patch, 10) + 1
        }

        resolve(`${major}.${minor}.${patch}`)

      } else {
        reject(error)
      }
    })
  })
}
