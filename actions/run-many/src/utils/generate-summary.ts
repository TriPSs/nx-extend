import * as core from '@actions/core'

export async function generateSummary(target, runProjects, output) {
  const failedProjects = output.split('\n')
    .filter((line) => line.trim().length > 1)
    .reduce((projects, line) => {
      if (projects === undefined && line.includes('Failed tasks')) {
        return []

      } else if (projects !== undefined && line.trim().startsWith('-')) {
        return projects.concat(line.replace('-', '').split(':').shift().trim())
      }

      return projects
    }, undefined) || []

    .map((project) => ({
      name: project,
      target,
      failed: failedProjects.includes(project)
    }))

  const summary = core.summary
    .addHeading(`nx affected:${target}`, 2)
    .addTable([
      [{ data: 'Project', header: true }, { data: 'Result', header: true }],

      ...runProjects.reduce((table, project) => {
        table.push([
          project,
          failedProjects.includes(project) ? ':x:' : ':white_check_mark:\t'
        ])
        return table
      }, [])
    ])

  // TODO:: Add links to the cloud run / functions / firebase hosting / vercel urls
  // summary.addLink('View staging deployment!', 'https://github.com')

  await summary.write()
}
