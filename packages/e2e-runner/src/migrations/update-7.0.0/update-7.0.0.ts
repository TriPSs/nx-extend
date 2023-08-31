/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDependenciesToPackageJson, getProjects, removeDependenciesFromPackageJson, Tree, updateProjectConfiguration } from '@nx/devkit'
import { existsSync } from 'fs'
import { join } from 'path'

export default function update(host: Tree) {
  const projects = getProjects(host)
  let hadProject = false

  for (const [name, config] of projects.entries()) {
    let updated = false

    Object.keys(config.targets).forEach((target) => {
      if (
        config.targets[target].executor === '@nx-extend/e2e-runner:run'
        && config.targets[target].options?.runner === 'playwright'
      ) {
        updated = true
        hadProject = true

        let playwrightConfig = undefined

        if (existsSync(join(config.root, 'playwright.config.ts'))) {
          playwrightConfig = join(config.root, 'playwright.config.ts')

        } else if (existsSync(join(config.root, 'playwright.config.js'))) {
          playwrightConfig = join(config.root, 'playwright.config.js')
        }

        delete config.targets[target].options.runner
        config.targets[target].options = {
          runner: '@nx/playwright',
          config: playwrightConfig,

          ...config.targets[target].options
        }
      }
    })

    if (updated) {
      updateProjectConfiguration(host, name, config)
    }
  }

  if (hadProject) {
    return addDependenciesToPackageJson(host, {}, {
      '@nx/playwright': '16.7.4'
    })
  }
}
