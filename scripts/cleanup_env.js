const { cleanUp } = require('../infrastructure/scripts/clean-up')
const { loadConfig } = require('./get-config')

const cleanUpTenants = async () => {
  if (!process.env.MWA_ACCOUNT) {
    console.log('Account is required!')
    return
  }

  if (!process.env.MWA_STAGE) {
    console.log('Stage is required!')
    return
  }

    try {
      const configInfo = loadConfig(
        process.env.MWA_ACCOUNT,
        process.env.MWA_STAGE,
        'application.yml',
      )

      if (configInfo.cleanUp.localDisabled) {
        console.log('Cleanup script is not allowed locally for this environment.')
        return
      }
      
      const tenantIds = Object.keys(configInfo.tenants)
      console.log('scripts/cleanup_env.js tenants found', tenantIds)

      for (let i = 0; i < tenantIds.length; i += 1) {
        console.log('scripts/cleanup_env.js iterating tenant', tenantIds[i]) //, configInfo.tenants[tenantIds[i]])
        // Test account doesn't have test tenant so should have an exception
        if (configInfo.tenants[tenantIds[i]].cleanUp.localDisabled) {
          console.log('scripts/cleanup_env.js cleanUp.localDisabled=true', tenantIds[i])
        }
        else {
          console.log('scripts/cleanup_env.js checking tenant id', process.env.MWA_TENANT, tenantIds[i])
          if (!process.env.MWA_TENANT || tenantIds[i] === process.env.MWA_TENANT) {
            console.log('scripts/cleanup_env.js cleaning up', tenantIds[i])
            await cleanUp(configInfo, tenantIds[i])
          }
          else {
            console.log('scripts/cleanup_env.js skipping tenant', tenantIds[i])
          }
        }
      }
      console.log('scripts/cleanup_env.js iteration complete')
    } catch (err) {
      console.log('scripts/cleanup_env.js error occurred', err)
      console.log(JSON.stringify(err))
    }
}

cleanUpTenants()
