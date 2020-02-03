import { GetAssetsHierarchy } from '../graphql/queries'

export const RAG = {
  R: '#f69898',
  A: '#ffe2b4',
  G: '#baf9ba',
}

export const getAssetInfo = (asset, allRecords, isCreate, assetType) => {
  // Getting facility name
  let assetInfoStr = ''

  if (assetType === 'facility') {
    return asset.name
  }

  const facility = allRecords.facilities.find(item => item.id === asset.facilityId)
  if (!facility) {
    return null
  }
  assetInfoStr = facility.name

  const floor = allRecords.floors.find(item => item.id === asset.floorId)
  if (!floor && !isCreate) {
    return null
  }
  assetInfoStr = `${assetInfoStr}, ${isCreate && assetType === 'floor' ? asset.name : floor.name}`
  if (assetType === 'floor') {
    return assetInfoStr
  }

  const space = allRecords.spaces.find(item => item.id === asset.spaceId)
  if (!space && !isCreate) {
    return null
  }
  assetInfoStr = `${assetInfoStr}, ${isCreate && assetType === 'space' ? asset.name : space.name}`
  if (assetType === 'space') {
    return assetInfoStr
  }

  const assetItem = allRecords.assets.find(item => item.id === asset.id)
  if (!assetItem && !isCreate) {
    return null
  }
  assetInfoStr = `${assetInfoStr}, ${isCreate ? asset.type : assetItem.type}`
  if (assetType === 'asset') {
    return assetInfoStr
  }

  return null
}

export const makeDetailedAssets = assets =>
  assets
    .map(asset => ({
      ...asset,
      type: `${asset.assetType.description}-${asset.assetType.legacyId}`,
      facets: JSON.parse(asset.facets),
      notes: JSON.parse(asset.notes),
    }))
    .map(obj => ({
      ...obj,
      facets: obj.facets && {
        ...obj.facets,
        condition: obj.facets.condition && obj.facets.condition.code,
      },
    }))

export const makeCopyAsset = (asset, facets) => ({
  ...asset,
  status: 'IN_PROGRESS',
  ...facets.reduce(
    (prev, obj) => {
      if (obj.copy === false) {
        prev[obj.element][obj.key] = ''
      }
      return prev
    },
    { facets: asset.facets, notes: asset.notes },
  ),
})

export const createAssetInput = input => ({
  createdAtClient: input.createdAtClient,
  createdBy: input.createdBy,
  createdUser: input.createdUser,
  tenantId: input.tenantId,
  id: input.id,
  facilityId: input.facilityId,
  floorId: input.floorId,
  spaceId: input.spaceId,
  assetType: {
    facets: null,
    ...input.assetType,
  },
  facets: JSON.stringify(input.facets),
  notes: JSON.stringify(input.notes),
  images: input.images,
  projectId: input.projectId,
  siteId: input.siteId,
  version: input.version,
})

export const padWithZeros = (number, length) => {
  let myString = `${number}`
  while (myString.length < length) {
    myString = `0${myString}`
  }

  return myString
}

export const getHierarchy = async projects => {
  await window.appsyncClient.hydrated()

  const data = await Promise.all(
    projects.map(project =>
      window.appsyncClient
        .query({
          query: GetAssetsHierarchy,
          variables: { projects: [project] },
          fetchPolicy: 'cache-first',
        })
        .then(res => {
          window.appsyncClient.writeQuery({
            query: GetAssetsHierarchy,
            variables: { projects: [project] },
            data: res.data,
          })
          return res.data && res.data.getHierarchy && JSON.parse(res.data.getHierarchy)
        }),
    ),
  )

  const allHierarchy = data.reduce((prev, obj) => ({ ...prev, ...obj }), {})
  window.appsyncClient.writeQuery({
    query: GetAssetsHierarchy,
    variables: { projects },
    data: { getHierarchy: JSON.stringify(allHierarchy) },
  })

  return data
}
