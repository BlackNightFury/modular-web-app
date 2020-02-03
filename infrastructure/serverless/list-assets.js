const { listRecords } = require('./list-records')
const defaultMiddleware = require('./middleware/index').default

const listAssets = async event => {
  try {
    const { items } = await listRecords(event)
    return {
      items: items.map(obj => ({
        ...obj,
        facilityId: obj.facility && obj.facility.id,
        floorId: obj.floor && obj.floor.id,
        spaceId: obj.space && obj.space.id,
        projectId: obj.project && obj.project.id,
        siteId: obj.site && obj.site.id,
      })),
    } //eslint-disable-line
  } catch (err) {
    throw err
  }
}

module.exports.listAssets = listAssets;
module.exports.lambda = defaultMiddleware(listAssets, {
  role: 'reader',
  idLocation: 'filters',
})
