#!/usr/bin/env node

const yargs = require('yargs')
// const _ = require('lodash')
const AWS = require('aws-sdk')

const ssm = new AWS.SSM()
const hash = require('object-hash')
const { loadConfig } = require('../scripts/get-config')
const { getCurrentCommit, hashDirectory } = require('./common')

yargs.parserConfiguration({
  'camel-case-expansion': false,
  // "dot-notation": false
})

const { argv } = yargs.command('$0 [account] [environment]', 'Persist environment details').help()


// console.log(process.argv)
// console.log(argv)

// const command = argv.cmd
const { account, environment } = argv
// const additionalParams = argv._
// const profile = process.env.AWS_PROFILE

console.log(`Persisting environment details for account ${account} environment ${environment}`)

const persistEnvironmentDetails = (memo) => {

	console.log('persistEnvironmentDetails', memo)

	const environmentConfig = loadConfig(account, memo.environment.name, 'application.yml')
	// console.log('environmentInfo', environmentConfig)

	const environmentDetails = {
		commitId : memo.git.commit.hash,
		configHash : hash(environmentConfig),
		slsHash : memo.sls.current,
	}
	
	const params = {
  	Name: `elias-mwa-${account}-${memo.environment.name}-environment`,
  	Type: 'SecureString',
  	Value: JSON.stringify(environmentDetails),
  	Overwrite: true
	};

	console.log('persisting parameter', params)
	
	ssm.putParameter(params, (err, data) => {
	  if (err) {
	  	console.log('Unexpected error message', err, err.stack)
  	}
	  else	{
	  	console.log('Saved parameter', data)
	  }
	});
}

const getSlsHash = (memo) => {
	console.log('getSlsHash')
	
	// git diff --name-only master..feature/EMW-327-tidying-up-facets infrastructure/serverless
	// git diff --name-only 3f8f5f34a9369ff1f7b7dba124e0c4d6182bba19..800507ce infrastructure/serverless

	const path = './infrastructure/serverless'
	
	return hashDirectory(path)
		.then(hashedValue => {
			console.log('hashedValue', hashedValue)
			memo.sls = { current : hashedValue }
			return memo
		})
		.catch((err) => {
			console.log('Unable to check sls changes', err)
			return memo
		})
}

getCurrentCommit()
	.then(getSlsHash)
	.then(persistEnvironmentDetails)
	.then(status => {
		console.log('status', status)

		
	})
	.catch(err => {
		console.log('Error occurred in persist-environment')
		console.log(err)
		process.exit(1)
	})

// persistEnvironmentDetails()