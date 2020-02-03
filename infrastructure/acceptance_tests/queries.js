export const listProjectIDsQuery = `query listProjects($tenantId: String!, $fields: [String]) {
  listProjects(filters: { tenantId: $tenantId }, fields: $fields) {
    items {
      id
    }
    nextToken
  }
}`

export const listSiteIDsQuery = `query listSites($tenantId: String!, $fields: [String]) {
  listSites(filters: { tenantId: $tenantId }, fields: $fields) {
    items {
      id
    }
    nextToken
  }
}`

export const listFacilityIDsQuery = `query listFacilities($tenantId: String!, $fields: [String]) {
  listFacilities(filters: { tenantId: $tenantId }, fields: $fields) {
    items {
      id
    }
    nextToken
  }
}`

export const listFloorIDsQuery = `query listFloors($tenantId: String!, $fields: [String]) {
  listFloors(filters: { tenantId: $tenantId }, fields: $fields) {
    items {
      id
    }
    nextToken
  }
}`

export const listSpaceIDsQuery = `query listSpaces($tenantId: String!, $fields: [String]) {
  listSpaces(filters: { tenantId: $tenantId }, fields: $fields) {
    items {
      id
    }
    nextToken
  }
}`

export const listAssetIDsQuery = `query listAssets($tenantId: String!, $fields: [String]) {
  listAssets(filters: { tenantId: $tenantId }, fields: $fields) {
    items {
      id
      assetType {
        virtual
      }
      spons {
        lifecycle
        replacementCost
        totalReplacementCost
      }
    }
    nextToken
  }
}`

export const getManufacturersQuery = `query getManufacturers($tenantId: String!) {
  getManufacturers(tenantId: $tenantId)
}`
