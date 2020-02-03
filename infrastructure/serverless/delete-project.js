const { updateAsset } = require('./update-asset')
const { deleteItem, getChildren } = require('./delete-record')
const { deleteFacility } = require('./delete-facility')
const defaultMiddleware = require('./middleware/index').default

const deleteProject = async event => {
  const { input } = event
  const { force, ...restData } = input

  try {
    if (!force) {
      const updatedItem = await updateAsset({ input: { ...restData, isDeleted: true } })
      return updatedItem
    }

    const { tenantId, id, environment } = input
    const facilities = await getChildren(tenantId, {}, 'facility', environment)
    await Promise.all(
      facilities.map(item =>
        deleteFacility({
          input: {
            tenantId,
            id: item.id,
            force: true,
            environment,
          },
        }),
      ),
    )

    await deleteItem(tenantId, { id }, 'project', environment) //eslint-disable-line no-await-in-loop
  } catch (err) {
    throw err
  }
}

module.exports.deleteProject = deleteProject
module.exports.lambda = defaultMiddleware(deleteProject, { role: 'writer', idLocation: 'input' })
