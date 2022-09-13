const core = require('@actions/core')

module.exports.generateSummary = async function (target,projects) {
  await core.summary
    .addHeading(`nx affected:${target}`, 2)
    .addTable([
      [{ data: 'Target', header: true }, { data: 'Result', header: true }],

      ...projects.reduce((table, project) => {
        table.push([
          project.name,
          project.failed ? ':x:' : ':white_check_mark:\t'
        ])
        return table
      }, []),
    ])
    // TODO:: Add links to the cloud run / functions / firebase hosting / vercel urls
    // .addLink('View staging deployment!', 'https://github.com')
    .write()
}
