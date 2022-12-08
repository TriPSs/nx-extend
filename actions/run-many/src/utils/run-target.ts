import * as core from '@actions/core'
import { logger } from '@nrwl/devkit'

import type { ProjectConfiguration } from 'nx/src/config/workspace-json-project-json'

import { argv } from '../run-many'
import { buildCommand } from './build-command'
import { execCommand } from './exec'
import { generateSummary } from './generate-summary'
import { getProjectsWithTarget } from './get-projects-with-target'
import { getRestArgs } from './get-rest-args'

export async function runTarget(projects: Map<string, ProjectConfiguration>, runProjects: string[], target: string, config?: string, parallel?: string, withSummary?: boolean) {
  const projectsWithTarget = getProjectsWithTarget(projects, runProjects, target)

  if (projectsWithTarget.length === 0) {
    logger.info(`No projects to run for target "${target}"`)
    return
  }

  const runManyCommandParts = [
    'npx nx run-many',
    `--target=${target}`,
    `--projects=${projectsWithTarget.join(',')}`,
    config && `--configuration=${config}`,
    (core.isDebug() || argv.verbose) && '--verbose',
    `${getRestArgs()}`
  ]

  switch (target) {
    case 'build':
      if (!config) {
        runManyCommandParts.push('--prod')
      }
      break

    case 'deploy':
      if (!parallel) {
        runManyCommandParts.push('--parallel=2')
      }
      break

    case 'test':
      if (!parallel) {
        runManyCommandParts.push('--parallel=4')
      }
      break
  }

  if (parallel) {
    runManyCommandParts.push(`--parallel=${parallel}`)
  }

  const runManyResult = execCommand(buildCommand(runManyCommandParts))

  if (!runManyResult.success) {
    core.setFailed('Run many command failed!')
  }

  if (withSummary) {
    try {
      await generateSummary(target, projectsWithTarget, runManyResult.output)

    } catch (err) {
      logger.warn(`Error generating Github summary: ${err.message || err}`)
    }
  }
}
