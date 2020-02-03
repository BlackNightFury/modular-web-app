
const _ = require('lodash')
const simpleGit = require('simple-git/promise')()
const hcl = require('hcl')
const fs = require('fs')
const { hashElement } = require('folder-hash');

function flattenHcl(c) {
  //I'm sure there should be something quicker than this!
  return _.reduce(c, (memo, value) => _.merge(memo, value), {})
}

module.exports.getCurrentCommit = () => {
	// git log -1 --pretty=format:'%an'
	// const accountConfig = loadConfig(account, '', 'application.yml')
	// console.log('accountConfig', accountConfig)

	const file = fs.readFileSync(`./etc/dev/environments.tfvars`, 'utf8')

  const config = hcl.parse(file)

  // console.log(config)

	return simpleGit
		.log()
		.then(res => {
			const committer = flattenHcl(
	      _.find(config.environments, e => _.find(e.value, v => _.includes(v.emails, res.latest.author_email))).value,
	    )
			// console.log(environment)
			console.log(`getCurrentCommit environment ${committer.name}`)
			return { git : { commit : res.latest, committer }, environment : { name : committer.name } }
		})
}

module.exports.hashDirectory = (directory) => {

	const options = {
	    folders: { exclude: ['node_modules'] },
	};
	 
	console.log('Creating a hash over the current folder:');

	return hashElement(directory, options)
	    .then(hashedDir => {
	        // console.log(hashedDir.toString());
	        const singleHash = hashedDir.hash
	        // const singleHash = hash(hashedDir)
	        console.log('singleHash', singleHash)
	        return singleHash
	    })
	    .catch(error => {
	        console.error('hashing failed:', error);
	        throw error;
	    });
}