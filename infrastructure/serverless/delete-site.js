const { updateAsset } = require('./update-asset')
const { deleteItem } = require('./delete-record')
const defaultMiddleware = require('./middleware/index').default

const deleteSite = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    if (!force) {
      const updatedItem = await updateAsset({ input: { ...restData, isDeleted: true } })
      return updatedItem
    }

    const { tenantId, id, environment } = input

    await deleteItem(tenantId, { id }, 'site', environment)
  } catch (err) {
    throw err
  }
}

module.exports.deleteSite = deleteSite
module.exports.lambda = defaultMiddleware(deleteSite, { role: 'writer', idLocation: 'input' })
