const { updateAsset } = require('./update-asset')
const { deleteItem } = require('./delete-record')

//eslint-disable-next-line
module.exports.lambda = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    if (!force) {
      const updatedItem = await updateAsset({ input: { ...restData } })
      return updatedItem
    }

    await deleteItem(tenantId, { id }, 'migration', environment)
  } catch (err) {
    throw new Error('DB Error!')
  }
}
