const { Client } = require('elasticsearch')
const { uploadImages } = require('./image')

const defaultMiddleware = require('./middleware/index').default

const createRecord = async event => {
  const esClient = Client({
    host: process.env.ELASTICSEARCH_HOST,
    connectionClass: require('http-aws-es'),
  })

  const { input } = event
  const esIndex = `${input.environment}-${input.tenantId.toLowerCase()}`
  const esType = 'docs'
  await uploadImages(input)
  try {
    input.version = 'v0001'
    await esClient.index({
      index: esIndex,
      type: esType,
      refresh: true,
      body: input,
    })

    input.version = 'v0000'
    input.currentVersion = 'v0001'
    await esClient.index({
      index: esIndex,
      type: esType,
      refresh: true,
      body: input,
    })

    return input
  } catch (err) {
    throw err
  }
}

module.exports.createRecord = createRecord
module.exports.lambda = defaultMiddleware(createRecord, { role: 'writer', idLocation: 'input' })
