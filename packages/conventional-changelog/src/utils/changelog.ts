import * as conventionalChangelog from 'conventional-changelog'
import { Options } from 'conventional-changelog'
import { Context, GitRawCommitsOptions } from 'conventional-changelog-core'

export interface ChangelogOptions {

  preset: string
  tagPrefix: string

}

export const generate = (options: Options, context?: Partial<Context>, gitRawCommits?: GitRawCommitsOptions): Promise<string> => new Promise((resolve) => {
  const changelogStream = conventionalChangelog(options, context, gitRawCommits)

  let changelog = ''

  changelogStream
    .on('data', (data) => {
      changelog += data.toString()
    })
    .on('end', () => resolve(changelog))
})
