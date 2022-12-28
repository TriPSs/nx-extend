import {
  addDependenciesToPackageJson,
  ProjectConfiguration, readJsonFile,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
  writeJsonFile
} from '@nrwl/devkit'
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial'

import { FirebaseHostingGeneratorSchema } from './schema'

export default async function (
  host: Tree,
  options: FirebaseHostingGeneratorSchema
) {
  const app = readProjectConfiguration(host, options.target)

  if (!app) {
    return {
      success: false
    }
  }

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

export function addToFirebaseJson(
  host: Tree,
  app: ProjectConfiguration,
  site: string
) {
  const firebaseJsonLocation = 'firebase.json'

  let firebaseJson = {
    hosting: [
      {
        target: site,
        public: app?.targets?.build?.options?.outputPath || null,
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [
          {
            source: '**',
            destination: '/index.html'
          }
        ]
      }
    ]
  }

  if (host.exists(firebaseJsonLocation)) {
    const existingFirebaseJson = readJsonFile(firebaseJsonLocation)

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

  writeJsonFile(firebaseJsonLocation, firebaseJson)

  return runTasksInSerial(addDependenciesToPackageJson(
    host,
    {},
    {
      'firebase-tools': '11.9.0'
    }
  ))
}
