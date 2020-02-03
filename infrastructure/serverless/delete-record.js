const AWS = require('aws-sdk')
const elasticsearch = require('elasticsearch')
const awsHttpClient = require('http-aws-es')
const { getQueryOptions } = require('./utils')

const esClient = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  connectionClass: awsHttpClient,
})

AWS.config.update({ region: 'eu-west-2' })
const esType = 'docs'

const deleteItem = (tenantId, filterIds, dataType, environment) => {
  try {
    const esIndex = `${environment}-${tenantId.toLowerCase()}`
    const moreOptions = getQueryOptions(filterIds)
    return esClient.deleteByQuery({
      index: esIndex,
      type: esType,
      refresh: true,
      body: {
        query: {
          bool: {
            must: [{ match: { dataType } }, { match: { environment } }, ...moreOptions],
          },
        },
      },
      conflicts: 'proceed',
    })
  } catch (err) {
    throw err
  }
}

const getChildren = async (tenantId, filterIds, dataType, environment) => {
  try {
    const esIndex = `${environment}-${tenantId.toLowerCase()}`
    const moreOptions = getQueryOptions(filterIds)

    const results = await esClient.search({
      index: esIndex,
      type: esType,
      body: {
        from: 0,
        size: 10000,
        query: {
          bool: {
            must: [
              { match: { version: 'v0000' } },
              { match: { dataType } },
              { match: { environment } },
              ...moreOptions,
            ],
          },
        },
      },
    })
    return results.hits.hits.map(obj => obj._source)
  } catch (err) {
    throw err
  }
}

module.exports = {
  deleteItem,
  getChildren,
}
