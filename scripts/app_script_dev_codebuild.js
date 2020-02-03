#!/usr/bin/env node

//Trying to return json from the yml, for use by terraform - tf doesn't execute the file, just tries to read the JS code!

// const { merge } = require('lodash')
// const { join } = require('path')

// const { loadConfig } = require('./get-config')
// const account = process.env.YML_ACCOUNT
// const environment = process.env.TFVAR_ENVIRONMENT

// // const { account, stage } = serverless.processedInput.options
// const environmentConfig = loadConfig(account, '', 'environments.yml', { debug: false})

// console.log(JSON.stringify(environmentConfig));

const fs = require('fs')
const hcl = require('hcl')
const _ = require('lodash')
const { execSync } = require('child_process')
const LCL = require('last-commit-log')

const lcl = new LCL()

function flattenHcl(c) {
  //I'm sure there should be something quicker than this!
  return _.reduce(c, (memo, value) => _.merge(memo, value), {})
}

lcl
  .getLastCommit()
  .then(commit => {
    console.log(`Using environment based on committer ${commit.committer.email}`)

    const committer = commit.committer.email
    const file = fs.readFileSync(`./etc/dev/environments.tfvars`, 'utf8')

    const config = hcl.parse(file)

    // console.log('config', config);

    const environment = flattenHcl(
      _.find(config.environments, e => _.find(e.value, v => _.includes(v.emails, committer))).value,
    )

    const environmentName = environment.name

    console.log(`Using environment ${environmentName} based on committer`)

    const options = {
      stdio: 'inherit',
      cwd: './',
      env: _.extend(process.env, {}),
    }

    const command = `pm2 start npm -- start -- --stage ${environmentName} --account dev & wait-on http://localhost:8000`
    console.log(`Executing command ${command}`)
    execSync(command, options)
  })
  .catch(ex => {
    console.log('Error occurred', ex)
  })
