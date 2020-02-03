const { Client } = require('elasticsearch')
const { uploadImages } = require('./image')
const { padWithZeros, getQueryOptions } = require('./utils')

const defaultMiddleware = require('./middleware/index').default

const updateRecord = async event => {
  const { input } = event
  await uploadImages(input, true)

  const esClient = Client({
    host: process.env.ELASTICSEARCH_HOST,
    connectionClass: require('http-aws-es'),
  })

  try {
    const { currentVersion, ...restData } = input
    const esIndex = `${input.environment}-${input.tenantId.toLowerCase()}`
    const esType = 'docs'
    await esClient.index({
      index: esIndex,
      type: esType,
      refresh: true,
      body: restData,
    })

    const curData = await esClient.search({
      index: esIndex,
      type: esType,
      body: {
        query: {
          bool: {
            must: [
              { match: { version: 'v0000' } },
              { match: { dataType: input.dataType } },
              { match: { 'id.keyword': input.id } },
              { match: { environment: input.environment } },
            ],
          },
        },
      },
    })

    if (!curData.hits.hits[0]) {
      throw new Error('DB Error!')
    }
    const curDataId = curData.hits.hits[0]._id
    const curDataInfo = curData.hits.hits[0]._source

    await esClient.index({
      index: esIndex,
      type: esType,
      id: curDataId,
      refresh: true,
      body: {
        ...curDataInfo,
        ...restData,
        currentVersion: input.version,
        version: 'v0000',
      },
    })

    return {
      ...curDataInfo,
      ...restData,
      currentVersion: input.version,
      version: 'v0000',
    }
  } catch (err) {
    throw err
  }
}

const updateRecordStatus = async (
  tenantId,
  filterIds,
  dataType,
  environment,
  status,
  isDone = false,
) => {
  const esClient = Client({
    host: process.env.ELASTICSEARCH_HOST,
    connectionClass: require('http-aws-es'),
  })

  const esIndex = `${environment}-${tenantId.toLowerCase()}`
  const esType = 'docs'
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
          must_not: [{ match: { isDeleted: true } }], //eslint-disable-line
        },
      },
    },
  })

  const item = results.hits.hits[0] && results.hits.hits[0]._source

  if (!item) {
    return
  }

  if (item.status !== status) {
    if (!isDone || item.status !== 'DONE') {
      const { isCurrent, currentVersion, ...restData } = item
      const version = `v${padWithZeros(parseInt(currentVersion.slice(1), 10) + 1, 4)}`
      const updateParams = {
        input: {
          ...restData,
          version,
          status,
          completedAt: null,
          completedBy: null,
          environment,
        },
      }
      await updateRecord(updateParams)
    }
  }
}

module.exports.lambda = defaultMiddleware(updateRecord, { role: 'writer', idLocation: 'input' })

module.exports.updateRecordStatus = updateRecordStatus
module.exports.updateRecord = updateRecord
