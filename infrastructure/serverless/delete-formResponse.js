const { updateAsset } = require('./update-asset')
const { deleteItem } = require('./delete-record')

const defaultMiddleware = require('./middleware/index').default

//eslint-disable-next-line
const deleteFormResponse = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    if (!force) {
      const updatedItem = await updateAsset({ input: { ...restData, isDeleted: true } })
      return updatedItem
    }

    const { tenantId, id, environment } = input

    await deleteItem(tenantId, { id }, 'formResponse', environment) //eslint-disable-line no-await-in-loop
  } catch (err) {
    throw err
  }
}

module.exports.deleteFormResponse = deleteFormResponse
module.exports.lambda = defaultMiddleware(deleteFormResponse, {
  role: 'writer',
  idLocation: 'input',
})
