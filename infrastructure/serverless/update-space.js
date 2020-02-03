const { updateRecord, updateRecordStatus } = require('./update-record')

const defaultMiddleware = require('./middleware/index').default

const updateSpace = async event => {
  const { input } = event
  const { tenantId, facilityId, floorId, status, environment } = input

  try {
    let newEvent
    if (status !== 'DONE') {
      newEvent = {
        input: {
          ...input,
          completedAt: null,
          completedBy: null,
        },
      }
    } else {
      newEvent = {
        input: {
          ...input,
        },
      }
    }
    const updatedItem = await updateRecord(newEvent)
    await updateRecordStatus(
      tenantId,
      {
        facilityId,
        id: floorId,
      },
      'floor',
      environment,
      'IN_PROGRESS',
      status === 'DONE',
    )
    await updateRecordStatus(
      tenantId,
      { id: facilityId },
      'facility',
      environment,
      'IN_PROGRESS',
      status === 'DONE',
    )

    return updatedItem
  } catch (err) {
    throw err
  }
}
module.exports.updateSpace = updateSpace
module.exports.lambda = defaultMiddleware(updateSpace, { role: 'writer', idLocation: 'input' })
