import { readProjectConfiguration, updateProjectConfiguration, Tree } from '@nrwl/devkit'
import { ProjectConfiguration } from '@nrwl/tao/src/shared/workspace'
import { join } from 'path'

import { InitGeneratorSchema } from './schema'

export interface VersionFile {

  file: string

  versionLocation?: string

  unreleasedShaLocation?: string

  changelogShaLocation?: string

}

export default async function (
  host: Tree,
  options: InitGeneratorSchema
) {
  const app = readProjectConfiguration(host, options.name)

  let versionFile: VersionFile = null

  if (options.file === 'package-json') {
    versionFile = createPackageJson(host, app, options.name)

  } else {
    console.log('Sorry, not yet supported!')

    return
  }

  updateProjectConfiguration(host, options.name, {
    ...app,
    targets: {
      ...app.targets,
      'conventional-changelog': {
        executor: '@nx-extend/conventional-changelog:generate',
        options: {
          file: versionFile.file,
          versionLocation: versionFile.versionLocation,
          shaLocation: versionFile.unreleasedShaLocation
        },
        configurations: {
          production: {
            shaLocation: versionFile.changelogShaLocation
          }
        }
      }
    }
  })
}

export function createPackageJson(host: Tree, app: ProjectConfiguration, appName: string): VersionFile {
  const packageJsonLocation = join(
    app.root,
    'package.json'
  )

  let packageJson = {
    name: appName,
    version: '0.1.0',
    changelogSha: null,
    unReleasedSha: null
  }

  if (host.exists(packageJsonLocation)) {
    const existingPackageJson = JSON.parse(host.read(packageJsonLocation).toString('utf8'))

    packageJson = {
      ...existingPackageJson,
      version: existingPackageJson.version || '0.1.0',
      changelogSha: existingPackageJson.changelogSha || null,
      unReleasedSha: existingPackageJson.unReleasedSha || null
    }
  }

  host.write(
    packageJsonLocation,
    Buffer.from(JSON.stringify(packageJson, null, 2))
  )

  return {
    file: packageJsonLocation,
    changelogShaLocation: 'changelogSha',
    unreleasedShaLocation: 'unReleasedSha',
    versionLocation: 'version'
  }
}
