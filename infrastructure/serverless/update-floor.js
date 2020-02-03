const { Client } = require('elasticsearch')
const { updateRecord, updateRecordStatus } = require('./update-record')

const defaultMiddleware = require('./middleware/index').default

const changeStatusToDone = async (items, completedAt, completedBy) => {
  const updateItems = await Promise.all(
    items.map(item => {
      const { currentVersion, isCurrent, ...restItem } = item
      const version = `v${`0000${parseInt(currentVersion.slice(1), 10) + 1}`.slice(-4)}`

      return updateRecord({
        input: {
          ...restItem,
          createdAt: completedAt,
          completedAt,
          completedBy,
          version,
          status: 'DONE',
        },
      })
    }),
  )

  return updateItems
}

const updateFloor = async event => {
  const esClient = Client({
    host: process.env.ELASTICSEARCH_HOST,
    connectionClass: require('http-aws-es'),
  })

  try {
    const {
      input: { tenantId, status, facilityId, id, createdAt, createdBy, environment },
    } = event
    const esIndex = `${environment}-${tenantId.toLowerCase()}`
    const esType = 'docs'

    let updatedFloor
    if (status === 'DONE') {
      updatedFloor = await updateRecord({
        input: { ...event.input, completedAt: createdAt, completedBy: createdBy },
      })

      const spaces = await esClient.search({
        index: esIndex,
        type: esType,
        body: {
          query: {
            bool: {
              must: [
                { match: { version: 'v0000' } },
                { match: { dataType: 'space' } },
                { match: { 'facilityId.keyword': facilityId } },
                { match: { 'floorId.keyword': id } },
                { match: { environment } },
              ],
              must_not: [
                { match: { status: 'INACCESSIBLE' } },
              ]
            },
          },
        },
      })

      await changeStatusToDone(spaces.hits.hits.map(space => space._source), createdAt, createdBy)
    } else {
      updatedFloor = await updateRecord({
        input: { ...event.input, completedAt: null, completedBy: null },
      })
    }

    await updateRecordStatus(
      tenantId,
      { id: facilityId },
      'facility',
      environment,
      'IN_PROGRESS',
      status === 'DONE',
    )

    return updatedFloor
  } catch (err) {
    throw err
  }
}

module.exports.updateFloor = updateFloor
module.exports.lambda = defaultMiddleware(updateFloor, { role: 'writer', idLocation: 'input' })
