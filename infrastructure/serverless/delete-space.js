const { updateSpace } = require('./update-space')
const { deleteItem } = require('./delete-record')
const { deleteAsset } = require('./delete-asset')
const { padWithZeros } = require('./utils')
const { listAssets } = require('./list-assets')

const defaultMiddleware = require('./middleware/index').default

const deleteSpace = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    const { tenantId, facilityId, id, floorId, environment } = input

    const esIndex = `${environment}-${tenantId.toLowerCase()}`
    const { items: assets } = await listAssets({
      esIndex,
      dataType: 'asset',
      environment,
      filters: { 'facility.id': facilityId, 'floor.id': floorId, 'space.id': id },
      tenantId,
    })

    await Promise.all(
      assets.map(item =>
        deleteAsset({
          input: {
            ...item,
            force,
            dataType: 'asset',
            version: force
              ? item.currentVersion
              : `v${padWithZeros(parseInt(item.currentVersion.slice(1), 10) + 1, 4)}`,
          },
        }),
      ),
    )

    if (force) {
      await deleteItem(tenantId, { facilityId, floorId, id }, 'space', environment)
    } else {
      const updatedItem = await updateSpace({ input: { ...restData, isDeleted: true } })
      return updatedItem
    }
  } catch (err) {
    throw err
  }
}

module.exports.deleteSpace = deleteSpace
module.exports.lambda = defaultMiddleware(deleteSpace, { role: 'writer', idLocation: 'input' })
