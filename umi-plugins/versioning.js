const git = require('git-rev-sync')

export default function(api) {
  api.addEntryCodeAhead(() => {
    const buildDate = new Date().toISOString()
    const branch = git.branch();
    const commit = git.short();
    const { Version : version } = api.config.define
    console.log('version', version)
    
    return `window.buildDate='${buildDate}'; window.branch='${branch}'; window.commit='${commit}'; window.version='${version}'; console.log('This version was built at ${buildDate}, from branch ${branch} commit ${commit}, version ${version}!');`
  })
}
