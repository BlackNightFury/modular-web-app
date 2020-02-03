const sql = require('mssql')
const fs = require('fs')
const yaml = require('js-yaml')
const { Client } = require('elasticsearch')
const { join } = require('path')
const _ = require('lodash')

const middleware = require('./middleware').default

const aliasFile = './etc/static_data/manufacturers.yml'

function loadFacetInfo() {
  const configFile = join(__dirname, aliasFile)

  try {
    const file = fs.readFileSync(configFile, 'utf8')
    const doc = yaml.safeLoad(file)
    return doc
  } catch (e) {
    console.log('Config file not found.')
  }
  return {}
}

const convertToJSON = async ({ esIndex }) => {
  
  console.log(`getManufacturers convertToJSON esIndex=${esIndex}`)
  
  let manufacturers = []

  const esClient = Client({
    host: process.env.ELASTICSEARCH_HOST,
    connectionClass: require('http-aws-es'),
    log: 'trace',
  })

  try {
    const esType = 'docs'
    const esQuery = {
      index: esIndex,
      type: esType,
      body: {
        query: {
          bool: {
            must: [{ match: { version: 'v0000' } }, { match: { dataType: 'manufacturer' } }],
          },
        },
      },
    };
    
    console.log(`getManufacturers querying es`, esQuery)
    let curManufacturerStored = await esClient.search(esQuery)
    console.log(`getManufacturers es result`, curManufacturerStored)
    curManufacturerStored = curManufacturerStored.hits.hits.map(obj => obj._source)
    manufacturers = manufacturers.concat(curManufacturerStored.map(item => item.data.M.name.S))
  } catch (e) {
    console.log(`getManufacturers es exception`)
    console.log(e)
  }

  try {
    await sql.connect({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      server: process.env.server,
    })
    try {
      
      console.log(`getManufacturers querying sql`)
      const manufacturerQueryResult = await sql.query`SELECT DISTINCT(name) FROM manufacturer_lu`

      console.log(`getManufacturers sql result`, manufacturerQueryResult)
    
      await sql.close()

      manufacturers = manufacturers.concat(
        manufacturerQueryResult.recordset.map(manufacturer => manufacturer.name),
      )
    } catch (e) {
      console.log(`getManufacturers sql exception`)
      console.log(e)
      await sql.close()
    }
  } catch (e) {
    console.log(e)
  }

  const facetInfo = loadFacetInfo()

  const aliasObj = facetInfo.manufacturer_alias || {}
  Object.keys(aliasObj).forEach(obj => {
    aliasObj[obj.toLocaleLowerCase()] = aliasObj[obj]
  })
  manufacturers = manufacturers.map(obj => {
    const trimedObj = obj.trim()
    if (aliasObj[trimedObj.toLowerCase()]) {
      return aliasObj[trimedObj.toLowerCase()]
    }
    return trimedObj
  })

  return { manufacturers: _.uniq(manufacturers), alias: aliasObj }
}

const getManufacturers = async event => {
  try {
    const manufacturers = await convertToJSON(event)

    return manufacturers
  } catch (err) {
    console.log(err)
  }

  return { manufacturers: [], alias: {} }
}

module.exports.getManufacturers = getManufacturers
module.exports.lambda = middleware(getManufacturers, { role: 'rds-reader', idLocation: 'filters' })