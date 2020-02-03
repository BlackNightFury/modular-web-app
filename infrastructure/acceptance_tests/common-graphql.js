const { API } = require('aws-amplify')
const {
  listEliasInfoQuery,
  listFacilitiesQuery,
  listFloorsQuery,
  listSpacesQuery,
  getManufacturersQuery,
  getSpaceTypesQuery,
  getAssetsHierarchyQuery,
} = require('../../src/graphql/queries')
const {
  createProjectMutation,
  createFacilityMutation,
  createAssetMutation,
  createFloorMutation,
  createSpaceMutation,
  updateFacilityMutation,
  updateFloorMutation,
  updateSpaceMutation,
  createSiteMutation,
  updateAssetMutation,
  deleteAssetMutation,
  deleteSpaceMutation,
  deleteFloorMutation,
  generateReportMutation,
} = require('../../src/graphql/mutations')
const { onCreateSubscription } = require('../../src/graphql/subscriptions')

const gql = (query, variables) =>
  API.graphql({
    query,
    variables,
    authMode: 'AWS_IAM',
  })

export const listEliasInfo = id => gql(listEliasInfoQuery, { tenantId: id })
export const listSpaces = (id, facilityId, floorId, name) =>
  gql(listSpacesQuery, { tenantId: id, facilityId, floorId, name })
export const listFloors = (id, facilityId) => gql(listFloorsQuery, { tenantId: id, facilityId })
export const listFacilities = id => gql(listFacilitiesQuery, { tenantId: id })
export const createProject = input => gql(createProjectMutation, { input })
export const createFacility = input => gql(createFacilityMutation, { input })
export const createFloor = input => gql(createFloorMutation, { input })
export const createSpace = input => gql(createSpaceMutation, { input })
export const createAsset = input => gql(createAssetMutation, { input })
export const updateFacility = input => gql(updateFacilityMutation, { input })
export const updateFloor = input => gql(updateFloorMutation, { input })
export const updateSpace = input => gql(updateSpaceMutation, { input })
export const invokeListGql = (query, id, fields) => gql(query, { tenantId: id, fields })
export const createSite = input => gql(createSiteMutation, { input })
export const updateAsset = input => gql(updateAssetMutation, { input })
export const deleteFloor = input => gql(deleteFloorMutation, { input })
export const deleteSpace = input => gql(deleteSpaceMutation, { input })
export const deleteAsset = input => gql(deleteAssetMutation, { input })
export const getManufacturers = input => gql(getManufacturersQuery, { input })
export const getSpaceTypes = projects => gql(getSpaceTypesQuery, { projects })
export const getAssetsHierarchy = projects => gql(getAssetsHierarchyQuery, { projects })
export const generateReport = (filters, reportDetails) =>
  gql(generateReportMutation, { filters, reportDetails })

export const onCreate = (input, callback) =>
  gql(onCreateSubscription, input).subscribe({
    next: ({ value: { data } }) => callback(null, data),
    error: e => callback(e),
  })
