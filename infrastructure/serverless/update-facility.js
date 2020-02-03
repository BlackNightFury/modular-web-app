
const { updateRecord } = require('./update-record')
const defaultMiddleware = require('./middleware/index').default

const updateFacility = async event => {
  try {
    const updatedItem = await updateRecord(event)
    return updatedItem
  } catch (err) {
    throw err
  }
}

module.exports.updateFacility = updateFacility
module.exports.lambda = defaultMiddleware(updateRecord, {
  role: 'facility-writer',
  idLocation: 'input',
})
