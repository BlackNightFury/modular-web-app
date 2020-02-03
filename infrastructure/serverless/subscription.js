const { Client } = require('elasticsearch')
const defaultMiddleware = require('./middleware/index').default

const subscription = async (event, context, callback) => {
  try {
    const esClient = Client({
      host: process.env.ELASTICSEARCH_HOST,
      connectionClass: require('http-aws-es'),
    })

    const { facilityId, esIndex } = event

    const esType = 'docs'

    const results = await esClient.search({
      index: esIndex,
      type: esType,
      body: {
        from: 0,
        size: 100000,
        _source: {
          excludes: ['dataType'],
        },
        query: {
          bool: {
            must: [
              { match: { version: 'v0000' } },
              { match: { 'id.keyword': facilityId } },
              { match: { dataType: 'facility' } },
            ],
            must_not: [{ match: { isDeleted: true } }],
          },
        },
      },
    })

    if (results.hits.hits.length > 0) {
      callback()
    } else {
      callback('FACILITY_NOT_ALLOWED')
    }
  } catch (err) {
    throw err
  }
}

module.exports.lambda = defaultMiddleware(subscription, {
  role: 'reader',
  idLocation: 'filters',
})
