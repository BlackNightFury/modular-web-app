const { Client } = require('elasticsearch')
global.fetch = require('node-fetch')
const { loadConfig } = require('../scripts/get-config')

const config = loadConfig(process.env.MWA_ACCOUNT, process.env.MWA_STAGE, 'application.yml')

const { tenants, elasticSearchEndpoint } = config
const { tenantIndexMappings, sharedIndexMappings } = require('../infrastructure/scripts/es-index-mappings')

const { MWA_ACCOUNT : account, MWA_STAGE : stage, MWA_TENANT : tenant } = process.env

const remappingTenants = async () => {
  if (!account) {
    console.log('Account is required!')
    return
  }

  if (!stage) {
    console.log('Stage is required!')
    return
  }

  if (tenant) {
    console.log('Tenant was provided', tenant)
  }

  console.log('remappingTenants', elasticSearchEndpoint)
  // console.log(tenants)
  // process.exit();

  const esClient = await Client({
    host: elasticSearchEndpoint,
    connectionClass: require('http-aws-es'),
  })

  const reCreateIndex = async name => {
    try {
      /* Remove All Tenants */
      await esClient.indices.delete({
        index: `${process.env.MWA_STAGE}-${name}`.toLowerCase(),
      })
      console.log('Deleted: ', `${process.env.MWA_STAGE}-${name}`)
    } catch (e) {
      console.log('Deletion Error', `${process.env.MWA_STAGE}-${name}`, e)
    }
    try {
      const mappings = name === 'shared' ? sharedIndexMappings : tenantIndexMappings
      await esClient.indices.create({
        index: `${process.env.MWA_STAGE}-${name}`.toLowerCase(),

        body: {
          settings: {
            index: {
              max_result_window: 100000,
              max_inner_result_window: 100000,
            },
          },
          mappings: {
            ...mappings
          },
        },
      })
      console.log('Created: ', `${process.env.MWA_STAGE}-${name}`)
    } catch (e) {
      console.log('Creation Error', `${process.env.MWA_STAGE}-${name}`, e)
    }

  }

  if (tenant) {
    await reCreateIndex(tenant)
    // console.log(find(tenants, t => t.))
  }
  else {
    await Promise.all(
      Object.keys(tenants).map(async t => {
        if (t === 'admin') return
        reCreateIndex(t)
      }),
    )
    await reCreateIndex('shared')  
  }
  
  console.log('Finish')
}

remappingTenants()
