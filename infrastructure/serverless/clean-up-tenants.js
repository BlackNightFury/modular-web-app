const { cleanUp } = require('./scripts/clean-up')
const middleware = require('./middleware').simple

module.exports.cleanUpTenants = async () => {
  try {
    const configInfo = JSON.parse(process.env.CONFIG_INFO)
    if (configInfo.cleanUp.lambdaDisabled) return
    const tenantIds = Object.keys(configInfo.tenants)
    for (let i = 0; i < tenantIds.length; i += 1) {
      if (!configInfo.tenants[tenantIds[i]].cleanUp.lambdaDisabled) {
        await cleanUp(configInfo, tenantIds[i])
      }
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports.lambda = middleware(module.exports.cleanUpTenants)
