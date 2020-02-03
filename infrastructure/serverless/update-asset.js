const { updateRecord, updateRecordStatus } = require('./update-record')
const { getAssetDetails } = require('./create-asset')

const defaultMiddleware = require('./middleware/index').default

const updateAsset = async event => {
  const { input } = event
  const {
    tenantId,
    facilityId,
    floorId,
    spaceId,
    siteId,
    projectId,
    environment,
    ...restInput
  } = input
  const esIndex = `${input.environment}-${input.tenantId.toLowerCase()}`

  try {
    const { project, site, facility, floor, space } = await getAssetDetails(
      esIndex,
      environment,
      projectId,
      siteId,
      facilityId,
      floorId,
      spaceId,
    )

    const assetInput = {
      tenantId,
      environment,
      ...restInput,
      facility,
      floor,
      space,
      site,
      project,
    }

    if (!facility || !floor || (!space && spaceId)) {
      throw new Error('Information is not exist')
    }

    const updatedItem = await updateRecord({ ...event, input: assetInput })
    if (spaceId) {
      await updateRecordStatus(
        tenantId,
        { facilityId, floorId, id: spaceId },
        'space',
        environment,
        'IN_PROGRESS',
      )
    }
    await updateRecordStatus(
      tenantId,
      { facilityId, id: floorId },
      'floor',
      environment,
      'IN_PROGRESS',
    )
    await updateRecordStatus(tenantId, { id: facilityId }, 'facility', environment, 'IN_PROGRESS')

    return { ...updatedItem, facilityId, floorId, spaceId, siteId, projectId }
  } catch (err) {
    throw err
  }
}

module.exports.updateAsset = updateAsset
module.exports.lambda = defaultMiddleware(updateAsset, {
  role: 'asset-writer',
  idLocation: 'input',
})
