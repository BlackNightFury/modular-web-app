const { updateAsset } = require('./update-asset')
const { deleteItem, getChildren } = require('./delete-record')
const { deleteFloor } = require('./delete-floor')

const defaultMiddleware = require('./middleware/index').default

const deleteFacility = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    if (!force) {
      const updatedItem = await updateAsset({ input: { ...restData, isDeleted: true } })
      return updatedItem
    }

    const { tenantId, id, environment } = input

    const floors = await getChildren(tenantId, { facilityId: id }, 'floor', environment)
    await Promise.all(
      floors.map(item =>
        deleteFloor({
          input: {
            tenantId,
            facilityId: id,
            id: item.id,
            force: true,
            environment,
          },
        }),
      ),
    )

    await deleteItem(tenantId, { id }, 'facility', environment)
  } catch (err) {
    throw err
  }
}

module.exports.deleteFacility = deleteFacility
module.exports.lambda = defaultMiddleware(deleteFacility, { role: 'writer', idLocation: 'input' })
