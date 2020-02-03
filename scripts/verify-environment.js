#!/usr/bin/env node

const yargs = require('yargs')
const _ = require('lodash')
const AWS = require('aws-sdk')

const rds = new AWS.RDS()
const ssm = new AWS.SSM()
const hash = require('object-hash');
const { Client } = require('elasticsearch')
const { getCurrentCommit, hashDirectory } = require('./common')
const { loadConfig } = require('../scripts/get-config')

yargs.parserConfiguration({
  'camel-case-expansion': false,
  // "dot-notation": false
})

const { argv } = yargs.command('$0 [account] [environment]', 'Run verification').help()

const { account, environment } = argv
// const additionalParams = argv._
// const profile = process.env.AWS_PROFILE

console.log(`Verifying environment details for account ${account} environment ${environment}`)

const startRdsIfNotStarted = (memo) => {
	//Check if RDS is started
	console.log('startRdsIfNotStarted')

	const params = {
  	DBInstanceIdentifier: `elias-dotnet-${account}-db`
	};
	
	return rds.startDBInstance(params)
		.promise()
		.then(data => {
  		console.log('Started RDS', data)
  		memo.rds = { running : true, started : true }
  		return memo;
  	}, err => {
  		if (err && err.code === 'InvalidDBInstanceState' && /not stopped/g.exec(err.message)) {
	  		console.log('RDS is running')
	  		memo.rds = { running : true, started : false }
	  		return memo
		  }
	  	if (err) {

		  	console.log('Unexpected error message', err, err.stack)
		  	memo.rds = { running : false, started : false }
		  	return memo
	  	}
		  
  	})
}

const checkIfEtcConfigChanged = (memo, config) => {
	console.log(`checkIfEtcConfigChanged account ${account} environment ${memo.environment.name}`)
	const environmentConfig = loadConfig(account, memo.environment.name, 'application.yml')
	// console.log('environmentConfig', environmentConfig)

	const changed = _.isEmpty(config) ? false : config.configHash !== hash(environmentConfig)

	// console.log('checkIfConfigChanged', config, changed)
	memo.etcConfig = { changed }
	memo.es = { endpoint : environmentConfig.elasticSearchEndpoint }

	return memo
}
const getEnvironmentDetails = (memo) => {
	
	console.log(`getEnvironmentDetails account ${account} environment ${memo.environment.name}`)
	
	const params = {
  	Name: `elias-mwa-${account}-${memo.environment.name}-environment`,
  	WithDecryption : true
	};
	
	return ssm.getParameter(params)
		.promise()
		.then(data => {
			console.log('Got parameter', data)
	  	memo.envDetails = JSON.parse(data.Parameter.Value)
	  	return memo;
		}, err => {

		  if (err.code === 'ParameterNotFound') {
		  	console.log('Parameter not found, should be created', err)
		  	memo.envDetails = {}
		  	return memo
		  }
		  if (err) {
		  	console.log('Unexpected error message', err, err.stack)
		  	throw err
	  	}
	});
}


const checkIfSlsChangedWithHash = (memo) => {
	console.log('checkIfSlsChangedWithHash')
	
	// git diff --name-only master..feature/EMW-327-tidying-up-facets infrastructure/serverless
	// git diff --name-only 3f8f5f34a9369ff1f7b7dba124e0c4d6182bba19..800507ce infrastructure/serverless

	const path = './infrastructure/serverless'
	
	return hashDirectory(path)
		.then(hashedValue => {
			console.log('hashedValue', hashedValue)

			memo.sls = {
				current : hashedValue,
				//changed : memo.envDetails.slsHash ? hashedValue !== memo.envDetails.slsHash : false
			}

			return memo
		})
		.catch((err) => {
			console.log('Unable to check sls changes', err)
			memo.sls.changed = false
			return memo
		})
}

// const checkIfSlsChangedWithGit = (memo) => {
// 	console.log('checkIfSlsChangesWithGit')
	
// 	// git diff --name-only master..feature/EMW-327-tidying-up-facets infrastructure/serverless
// 	// git diff --name-only 3f8f5f34a9369ff1f7b7dba124e0c4d6182bba19..800507ce infrastructure/serverless

// 	const path = 'infrastructure/serverless'
	
// 	return simpleGit
// 		.revparse(['HEAD']) //Get the current commit ID
// 		.then(details => {
// 			memo.sls = { currentCommitId : details };
// 			return simpleGit
// 				.fetch(['origin', memo.envDetails.commitId]) //Ensure the commit we want to compare to is available
// 				.then(res => 
// 					// console.log('Fetched original branch', res)
					
// 					 simpleGit
// 						.diffSummary([details, memo.envDetails.commitId, path]) //Diff the current commit ID to that persisted
// 						.then(diff => {
// 							// console.log(diff)
// 							memo.sls.changed = diff.changed > 0
// 							return memo
// 						})
// 						.catch((err) => {
// 							console.log('Unable to check sls changes', err)
// 							memo.sls.changed = false
// 							return memo
// 						})
// 				)
// 				.catch((err) => {
// 					console.log('Unable to check sls changes', err)
// 					memo.sls.changed = false
// 					return memo
// 				})
			
// 		})
// }

const verifyElasticSearch = (memo) => {
	// try {
	console.log('verifyElasticSearch')
	const esClient = Client({
    host: memo.es.endpoint,
    connectionClass: require('http-aws-es'),
  })
  const esIndex = `${memo.environment.name}*`
  const esType = 'docs'
  
  return esClient.search({
    index: esIndex,
    type: esType,
    body: {
    	aggs : {
  			dataType : {
    			terms : { field : "dataType.keyword" }
  			}
			},
      query: {
        bool: {
          must: [
            { match: { environment: memo.environment.name } },
            { terms: { dataType: ["asset", "space", "floor", "facilities" ] } }
          ],
        },
      },
    },
  })
  .then(data => {
  	 // console.log('data', JSON.stringify(data.aggregations))
  
  		memo.es = { exceeded : data.hits.total > 1000, count : data.hits.total, dataTypes : data.aggregations.dataType.buckets }

  		return memo;
  })
  .catch (err => {
		memo.es = { exceeded : false, error : err }
  	return memo
	})
}

getCurrentCommit()
	.then(getEnvironmentDetails)
	.then(checkIfEtcConfigChanged)
	.then(verifyElasticSearch)
	.then(checkIfSlsChangedWithHash)
	.then(startRdsIfNotStarted)
	.then(status => {
		console.log('status', JSON.stringify(status, null, 2))

		if (status.sls.changed || status.etcConfig.changed || !status.rds.running || status.es.exceeded) {
			
			console.log("******Environment is not correct. Aborting build.******")

			if (status.sls.changed) {
				console.log("Serverless source code has changed, need to sls deploy.")
			}
			if (status.etcConfig.changed) {
				console.log("Etc source code has changed, need to sls deploy.")
			}
			if (!status.rds.running) {
				console.log("RDS is not running, need to start.")
			}
			if (status.es.exceeded) {
				console.log("ES has too much data, use cleanup script.")
			}
				
			process.exit(1)
		}
	})
	.catch(err => {
		console.log('Error occurred in verify-environment')
		console.log(err)
		process.exit(1)
	})
