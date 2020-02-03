const { createRecord } = require('./create-record')
const { updateRecordStatus } = require('./update-record')

const defaultMiddleware = require('./middleware/index').default

const createSpace = async event => {
  const { input } = event
  const { tenantId, facilityId, floorId, environment } = input

  try {
    await createRecord(event)
    await updateRecordStatus(
      tenantId,
      { facilityId, id: floorId },
      'floor',
      environment,
      'IN_PROGRESS',
    )
    await updateRecordStatus(tenantId, { id: facilityId }, 'facility', environment, 'IN_PROGRESS')

    return input
  } catch (err) {
    throw err
  }
}

module.exports.createSpace = createSpace
module.exports.lambda = defaultMiddleware(createSpace, { role: 'writer', idLocation: 'input' })
