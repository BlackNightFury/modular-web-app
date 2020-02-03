const { updateAsset } = require('./update-asset')
const { deleteItem } = require('./delete-record')

const defaultMiddleware = require('./middleware/index').default

const deleteAsset = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    if (!force) {
      const updatedItem = await updateAsset({ input: { ...restData, isDeleted: true } })
      return updatedItem
    }

    const { tenantId, facilityId, floorId, spaceId, id, environment } = input

    if (spaceId) {
      await deleteItem(
        tenantId,
        { 'facility.id': facilityId, 'floor.id': floorId, 'space.id': spaceId, id },
        'asset',
        environment,
      )
    } else {
      await deleteItem(
        tenantId,
        { 'facility.id': facilityId, 'floor.id': floorId, id },
        'asset',
        environment,
      )
    }
  } catch (err) {
    throw err
  }
}

module.exports.deleteAsset = deleteAsset
module.exports.lambda = defaultMiddleware(deleteAsset, {
  role: 'asset-writer',
  idLocation: 'input',
})
