const core = require('@actions/core')
const { FsTree } = require('nx/src/generators/tree')
const { logger, getProjects } = require('@nrwl/devkit')
const { execCommand, buildCommand } = require('@nx-extend/core')

const { generateSummary } = require('./utils/generate-summary')
const { getRestArgs } = require('./utils/get-rest-args')

async function run() {
  try {
    const nxTree = new FsTree(process.cwd(), false)
    const allProjects = getProjects(nxTree)

    // Get all options
    const tag = core.getInput('tag')
    const target = core.getInput('target', { required: true })
    const affectedTarget = core.getInput('affectedTarget')
    const jobIndex = core.getInput('index') || 1
    const jobCount = core.getInput('count') || 1
    const parallel = core.getInput('parallel')
    const preTargets = core.getMultilineInput('preTargets')
    const postTargets = core.getMultilineInput('postTargets')

    console.log(preTargets)
    console.log(postTargets)

    if (tag) {
      core.info(`Running all projects with tag "${tag}"`)
    }

    // Get all affected projects
    const { projects: affectedProjects } = execCommand(buildCommand([
      'npx nx print-affected',
      `--target=${affectedTarget || target}`,
    ]), {
      asJSON: true,
      silent: !core.isDebug()
    })

    // Filter out all projects that are not allowed
    const allowedProjects = [...allProjects].filter(([_, config]) => {
      // Check if the project has the ci=off tag
      const hasCiOffTag = (config?.tags ?? []).includes('ci=off')
      // Check if the project has the provided target
      const hasTarget = Object.keys(config?.targets ?? {}).includes(target)

      // If the project does not have the target or is disabled by ci=pff don't run it
      if (!hasTarget || hasCiOffTag) {
        return false
      }

      // If a tag is provided the project should have it
      return !tag || (config?.tags ?? []).includes(tag)
    }).map(([target]) => target)

    const projectsToRun = affectedProjects.filter((project) => {
      return allowedProjects.includes(project)
    })

    const sliceSize = Math.max(Math.floor(projectsToRun.length / jobCount), 1)
    const runProjects = jobIndex < jobCount
      ? projectsToRun.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
      : projectsToRun.slice(sliceSize * (jobIndex - 1))

    if (runProjects.length > 0) {
      const runManyCommandParts = [
        'npx nx run-many',
        `--target=${target}`,
        `--projects=${runProjects.join(',')}`,
        `${getRestArgs()}`
      ]

      switch (target) {
        case 'build':
          runManyCommandParts.push('--prod')
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

      try {
        await generateSummary(target, runProjects, runManyResult.output)

      } catch (err) {
        logger.warn('Error generating Github summary', err)
      }
    } else {
      logger.info('No projects to run')
    }
  } catch (err) {
    core.setFailed(err)
  }
}

run()
