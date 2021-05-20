import { readProjectConfiguration, updateProjectConfiguration, Tree } from '@nrwl/devkit'
import { ProjectConfiguration } from '@nrwl/tao/src/shared/workspace'
import { join } from 'path'

import { FirebaseHostingGeneratorSchema } from './schema'

export default async function (
  host: Tree,
  options: FirebaseHostingGeneratorSchema
) {
  const app = readProjectConfiguration(host, options.target)

  addToFirebaseJson(host, app, options.site)

  updateProjectConfiguration(host, options.target, {
    ...app,
    targets: {
      ...app.targets,
      deploy: {
        executor: '@nx-extend/firebase-hosting:deploy',
        options: {
          site: options.site
        }
      }
    }
  })
}

export function addToFirebaseJson(host: Tree, app: ProjectConfiguration, site: string) {
  const firebaseJsonLocation = 'firebase.json'

  let firebaseJson = {
    hosting: [{
      target: site,
      public: app?.targets?.build?.options?.outputPath || null,
      ignore: [
        'firebase.json',
        '**/.*',
        '**/node_modules/**'
      ]
    }]
  }

  if (host.exists(firebaseJsonLocation)) {
    const existingFirebaseJson = JSON.parse(host.read(firebaseJsonLocation).toString('utf8'))

    firebaseJson = {
      ...existingFirebaseJson,
      ...firebaseJson
    }

    if (existingFirebaseJson.hosting) {
      if (Array.isArray(existingFirebaseJson.hosting)) {
        firebaseJson.hosting = [
          ...existingFirebaseJson.hosting,
          ...firebaseJson.hosting
        ]

      } else {
        firebaseJson.hosting = [
          existingFirebaseJson.hosting,
          ...firebaseJson.hosting
        ]
      }
    }
  }

  host.write(
    firebaseJsonLocation,
    Buffer.from(JSON.stringify(firebaseJson, null, 2))
  )
}
