// config.js
// eslint-disable
const { merge, reduce } = require('lodash')
const { join } = require('path')

const { loadConfig } = require(`${join(__dirname, '../../scripts/get-config.js')}`) //eslint-disable-line

/* As we have 4KB of lambda environment variable restriction, we need to remove unnecessary config */
/* More details described in EMW-710 */
const removeUneccessarySlsConfig = tenants =>
  reduce(
    tenants,
    (result, value, tenant) => {
      const { dummyDataEnable, ...rest } = value
      result[tenant] = rest
      return result
    },
    {},
  )

const generate = (account, stage) => {
  const applicationConfig = loadConfig(account, stage, 'application.yml')
  const secretConfig = loadConfig(account, stage, 'secrets.yml')
  const accountConfig = loadConfig(account, stage, 'account.yml')
  const config = merge(applicationConfig, secretConfig, accountConfig)

  config.lambda_prune_automatic = config.lambda.prune_automatic || false
  config.lambda_prune_number = (config.lambda && config.lambda.prune_number) || 0

  const configForEnv = {
    tenants: removeUneccessarySlsConfig(config.tenants),
    globalUser: config.globalUser,
    aws: {
      project_region: config.aws.project_region,
      appsync: config.aws.appsync,
    },
    cleanUp: config.cleanUp,
  }

  config.__str = JSON.stringify(configForEnv)

  config.dnsPrefix = config.aws.dns_prefix || `${account || 'dev'}`
  config.account = account
  config.accountId = config.aws.account_id

  config.aws.vpc = config.aws.vpc
    ? {
        securityGroupIds: [config.aws.vpc.security_group_ids[0]],
        subnetIds: [config.aws.vpc.subnet_ids[0]],
      }
    : { securityGroupIds: null, subnetIds: null }

  return config
}

module.exports.generate = generate

module.exports.config = serverless => {
  const { account, stage } = serverless.processedInput.options
  return generate(account, stage)
}
