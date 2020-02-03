const { Client } = require('elasticsearch')
const { getQueryOptions } = require('./utils')

const defaultMiddleware = require('./middleware/index').default

const listRecords = async event => {
  try {
    const esClient = Client({
      host: process.env.ELASTICSEARCH_HOST,
      connectionClass: require('http-aws-es'),
    })

    const { filters, fields, environment, dataType, includeDeleted, esIndex } = event

    const esType = 'docs'

    if (dataType === 'asset') {
      const { projectId, facilityId, floorId, spaceId, siteId } = filters
      if (projectId) {
        filters.project = { id: projectId }
        delete filters.projectId
      }
      if (facilityId) {
        filters.facility = { id: facilityId }
        delete filters.facilityId
      }
      if (floorId) {
        filters.floor = { id: floorId }
        delete filters.floorId
      }
      if (spaceId) {
        filters.space = { id: spaceId }
        delete filters.spaceId
      }
      if (siteId) {
        filters.site = { id: siteId }
        delete filters.siteId
      }
    }
    
    const moreOptions = getQueryOptions(filters)

    const results = await esClient.search({
      index: esIndex,
      type: esType,
      body: {
        from: 0,
        size: 100000,
        _source: fields
          ? { includes: fields }
          : {
              excludes: ['dataType'],
            },
        query: {
          bool: {
            must: [
              { match: { version: 'v0000' } },
              { match: { dataType } },
              { match: { environment } },
              ...moreOptions,
            ],
            must_not: includeDeleted ? [] : [{ match: { isDeleted: true } }],
          },
        },
      },
    })

    return { items: results.hits.hits.map(obj => obj._source) } //eslint-disable-line
  } catch (err) {
    throw err
  }
}

module.exports.listRecords = listRecords
module.exports.lambda = defaultMiddleware(listRecords, {
  role: 'reader',
  idLocation: 'filters',
})
