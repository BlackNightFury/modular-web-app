const { createRecord } = require('./create-record')
const { updateRecordStatus } = require('./update-record')

const defaultMiddleware = require('./middleware/index').default

const createFloor = async event => {
  const { input } = event
  const { tenantId, facilityId, environment } = input

  try {
    await createRecord(event)
    await updateRecordStatus(tenantId, { id: facilityId }, 'facility', environment, 'IN_PROGRESS')

    return input
  } catch (err) {
    throw err
  }
}

module.exports.createFloor = createFloor
module.exports.lambda = defaultMiddleware(createFloor, { role: 'writer', idLocation: 'input' })
