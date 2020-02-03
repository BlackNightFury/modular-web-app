const { Client } = require('elasticsearch')
const { pick } = require('lodash')
const moment = require('moment')
const { createRecord } = require('./create-record')
const { updateRecordStatus } = require('./update-record')
const { getAdditionalAssetDataByIdFromCache } = require('./get-hierarchy-from-cache')

const defaultMiddleware = require('./middleware/index').default

const getAssetDetails = async (
  esIndex,
  environment,
  projectId,
  siteId,
  facilityId,
  floorId,
  spaceId,
) => {
  try {
    const esClient = Client({
      host: process.env.ELASTICSEARCH_HOST,
      connectionClass: require('http-aws-es'),
    })
    const esType = 'docs'

    const results = await esClient.search({
      index: esIndex,
      type: esType,
      body: {
        from: 0,
        size: 100000,
        query: {
          bool: {
            must: [
              { match: { version: 'v0000' } },
              { match: { environment } },
              {
                terms: {
                  'id.keyword': [projectId, siteId, facilityId, floorId, spaceId].filter(
                    obj => obj,
                  ),
                },
              },
            ],
          },
        },
      },
    })

    const requiredFields = {
      project: ['id', 'code', 'name'],
      site: ['id', 'name', 'postcode', 'code'],
      facility: ['id', 'code', 'name', 'status'],
      floor: ['id', 'name', 'status'],
      space: ['id', 'name', 'localName', 'department', 'type', 'status'],
    }

    const result = {}
    results.hits.hits
      .map(obj => obj._source)
      .forEach(obj => {
        result[obj.dataType] = pick(obj, requiredFields[obj.dataType])
      })

    return result
  } catch (err) {
    throw err
  }
}

const createAsset = async event => {
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
    const installDate = moment(restInput.facets['install-date'])
    let qty = 1

    if (restInput.facets.quantity) {
      qty = restInput.facets.quantity
    }

    const { assetType } = restInput

    console.log(
      'createAsset calling getAssetDetails',
      esIndex,
      environment,
      projectId,
      siteId,
      facilityId,
      floorId,
      spaceId,
    )

    const { project, site, facility, floor, space } = await getAssetDetails(
      esIndex,
      environment,
      projectId,
      siteId,
      facilityId,
      floorId,
      spaceId,
    )

    console.log('createAsset getAssetDetails result', project, site, facility, floor, space)

    console.log(
      'createAsset calling getAdditionalAssetDataByIdFromCache',
      environment,
      tenantId,
      assetType.tree,
    )

    const additionalAssetData = await getAdditionalAssetDataByIdFromCache(
      environment,
      tenantId,
      assetType.tree,
    )

    console.log('createAsset getAdditionalAssetDataByIdFromCache result', additionalAssetData)

    const assetReferences = {
      nrm: additionalAssetData.nrm,
      rics: additionalAssetData.rics,
      'sfg-20-ref': additionalAssetData['sfg-20-ref'],
      'sfg-20-version': additionalAssetData['sfg-20-version'],
    }
    const { replacementCost } = additionalAssetData

    // set lifecycle as 15 if it is not defined in hierarchy
    const lifecycle = additionalAssetData.lifecycle || 15
    const totalReplacementCost = replacementCost * qty
    const simpleCost = []
    const currentYear = new Date().getFullYear()
    const installDateYear = installDate.year()
    let iterateYear = installDateYear
    while (iterateYear < currentYear + 50) {
      simpleCost.push({
        year: iterateYear,
        replacement: totalReplacementCost,
      })

      iterateYear += lifecycle
    }

    // calculate eol
    installDate.add(lifecycle, 'years')
    const eol = installDate.format('YYYY-MM-DD')

    const cost = {
      simple: simpleCost,
    }
    const assetInput = {
      tenantId,
      environment,
      ...restInput,
      facility,
      floor,
      space,
      site,
      project,
      references: assetReferences,
      spons: {
        eol,
        lifecycle,
        replacementCost,
        totalReplacementCost,
      },
      cost,
    }

    if (!facility || !floor || (!space && spaceId)) {
      console.error(`Related records not found`, facility, floor, space, spaceId)
      throw new Error(`Related records not found`)
    }

    await createRecord({ ...event, input: assetInput })
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

    return {
      ...input,
      currentVersion: 'v0001',
      spons: {
        eol,
        lifecycle,
        replacementCost,
        totalReplacementCost,
      },
    }
  } catch (err) {
    throw err
  }
}

module.exports.getAssetDetails = getAssetDetails
module.exports.createAsset = createAsset
module.exports.lambda = defaultMiddleware(createAsset, {
  role: 'asset-writer',
  idLocation: 'input',
})
