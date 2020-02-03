#!/usr/bin/env node

const yargs = require('yargs')
const _ = require('lodash')
const { execSync } = require('child_process')
const { loadConfig } = require('../scripts/get-config')

yargs.parserConfiguration({
  'camel-case-expansion': false,
  // "dot-notation": false
})

const { argv } = yargs.command('$0 [cmd] [account]', 'Run terraform command').help()


// console.log(process.argv)
// console.log(argv)

const command = argv.cmd
const { account } = argv
const additionalParams = argv._
const profile = process.env.AWS_PROFILE
const dataDir = `../../etc/${account}/.terraform`

let commandArgs = ''

if (command === 'init') {
  commandArgs = `-backend-config=../../etc/${account}/backend.tfvars`
} else {
  const gitBranch = require('current-git-branch')()
  const username = require('username').sync()
  const applied = require('moment')().toISOString()

  const accountInfo = loadConfig(account, '', 'application.yml')
  const { tenants } = accountInfo
  const tenantStr = Object.keys(tenants)
    .map(
      tenantId =>
        `{"id"="${tenants[tenantId].id}"\n"tenantId"="${tenantId}"\n"imgBucket"="${
          tenants[tenantId].assetImagesS3Bucket
        }"}`,
    )
    .join(',')

  commandArgs = `-var-file=../../etc/${account}/account.tfvars`
  commandArgs += ` -var-file=../../etc/${account}/environments.tfvars`
  commandArgs += ` -var 'terraform__branch=${gitBranch}'`
  commandArgs += ` -var 'terraform__repo=modular-web-app' -var 'terraform__applied_by=${username}'`
  commandArgs += ` -var 'terraform__applied_at=${applied}'`
  commandArgs += ` -var 'tenants=[${tenantStr}]'`
}

commandArgs += ` ${additionalParams.join(' ')}`

console.log('Terraform state is stored in %s', dataDir)

console.log('Running terraform %s for %s using AWS profile %s', command, account, profile)

console.log(`terraform ${command} ${commandArgs}`)

const options = {
  stdio: 'inherit',
  cwd: './infrastructure/terraform',
  env: _.extend(process.env, {
    TF_DATA_DIR: dataDir,
    // YML_ENVIRONMENT: 'dev'
  }),
}

// process.exit()

// console.log(process.env)

// if (command === 'init') {
// 	var result = execSync(`rm -rf ${dataDir}`, options)
// 	console.log(result)

// }

const result = execSync(`terraform ${command} ${commandArgs}`, options)
console.log(result)
