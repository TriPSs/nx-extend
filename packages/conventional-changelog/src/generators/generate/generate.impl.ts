import { Tree } from '@nrwl/devkit'
import * as shell from 'shelljs'

import { bumpVersion, changelog, git } from '../../utils'
import { GenerateSchema } from './schema'

export interface VersionFile {

  file: string

  versionLocation?: string

  unreleasedShaLocation?: string

  changelogShaLocation?: string

}

export default async function (
  host: Tree,
  options: GenerateSchema
) {
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.exit(1)

    return
  }

  const rootPackageJsonString = host.read('./package.json')
  const packageJson = JSON.parse(rootPackageJsonString.toString())
  let generatedChangelog

  if (!options.production) {
    shell.echo('Generating "CHANGELOG.unreleased.md"')

    generatedChangelog = await changelog.generate({
        preset: options.preset,
        outputUnreleased: true,
        releaseCount: 1,
        tagPrefix: options.tagPrefix
      },
      {
        version: packageJson.version,
        currentTag: `${options.tagPrefix}${packageJson.version}`
      }
    )

    host.write('./CHANGELOG.unreleased.md', generatedChangelog)
  } else {
    shell.echo('Bumping package.json version')
    packageJson.version = await bumpVersion(options, packageJson.version)

    host.write('./package.json', JSON.stringify(packageJson, null, 2))

    generatedChangelog = await changelog.generate({
        preset: options.preset,
        outputUnreleased: true,
        releaseCount: options.releaseCount,
        tagPrefix: options.tagPrefix
      },
      {
        version: packageJson.version,
        currentTag: `${options.tagPrefix}${packageJson.version}`
      }
    )

    host.write('./CHANGELOG.md', generatedChangelog)
    console.log(generatedChangelog)
  }

  git.add()
  git.commit(`chore(release): ${options.tagPrefix}${packageJson.version}`)

  // For production we create git tag
  if (options.production) {
    git.createTag(`${options.tagPrefix}${packageJson.version}`, generatedChangelog)
  }

  git.push()
}

