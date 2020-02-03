const { updateFloor } = require('./update-floor')
const { deleteItem, getChildren } = require('./delete-record')
const { deleteSpace } = require('./delete-space')
const { deleteAsset } = require('./delete-asset')
const { listAssets } = require('./list-assets')
const { padWithZeros } = require('./utils')

const defaultMiddleware = require('./middleware/index').default

const deleteFloor = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    const { tenantId, facilityId, id, environment } = input

    const spaces = await getChildren(tenantId, { facilityId, floorId: id }, 'space', environment)
    await Promise.all(
      spaces.map(item =>
        deleteSpace({
          input: {
            ...item,
            force,
            version: force
              ? item.currentVersion
              : `v${padWithZeros(parseInt(item.currentVersion.slice(1), 10) + 1, 4)}`,
          },
        }),
      ),
    )

    const esIndex = `${environment}-${tenantId.toLowerCase()}`
    const { items: assets } = await listAssets({
      esIndex,
      dataType: 'asset',
      environment,
      filters: { 'facility.id': facilityId, 'floor.id': id },
      tenantId,
    })

    await Promise.all(
      assets.map(
        item =>
          !item.spaceId &&
          deleteAsset({
            input: {
              ...item,
              dataType: 'asset',
              force,
              version: force
                ? item.currentVersion
                : `v${padWithZeros(parseInt(item.currentVersion.slice(1), 10) + 1, 4)}`,
            },
          }),
      ),
    )

    if (force) {
      await deleteItem(tenantId, { facilityId, id }, 'floor', environment)
    } else {
      const updatedItem = await updateFloor({ input: { ...restData, isDeleted: true } })
      return updatedItem
    }
  } catch (err) {
    throw err
  }
}

module.exports.deleteFloor = deleteFloor
module.exports.lambda = defaultMiddleware(deleteFloor, { role: 'writer', idLocation: 'input' })
