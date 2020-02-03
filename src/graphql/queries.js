import gql from 'graphql-tag'

export const getAssetsHierarchyQuery = `query getHierarchy($projects: [ProjectInput]!)  {
  getHierarchy(projects: $projects)
}`
export const GetAssetsHierarchy = gql(getAssetsHierarchyQuery)

export const getManufacturersQuery = `query getManufacturers($tenantId: String)  {
  getManufacturers(tenantId: $tenantId)
}`
export const GetManufacturers = gql(getManufacturersQuery)

export const getSpaceTypesQuery = `query getSpaceTypes($projects: [Int]!)  {
  getSpaceTypes(projects: $projects)
}`
export const GetSpaceTypes = gql(getSpaceTypesQuery)

export const listEliasInfoQuery = `query listEliasInfo($tenantId: String, $facilityId: ID, $floorId: ID, $spaceId: ID) {
  listProjects(filters: { tenantId: $tenantId }) {
    items {
      id
      createdAt
      currentVersion
      sites
      name
      rag
      readonly
      preSurveyQuestionnaire
      docs {
        id
        text
      }
      code
    }
    nextToken
  }
  listSites(filters: { tenantId: $tenantId }) {
    items {
      id
      createdAt
      currentVersion
      name
      postcode
      code
    }
    nextToken
  }
  listFacilities(filters: {tenantId: $tenantId}) {
    items {
      id
      createdAt
      currentVersion
      siteId
      name
      rag
      status
      docs {
        id
        text
      }
      facets
      notes
      images {
        dataUri
        picture {
          bucket
          key
        }
      }
      tenantId
      code
    }
    nextToken
  }
  listFloors(filters: {tenantId: $tenantId, facilityId: $facilityId}) {
    items {
      id
      createdAt
      currentVersion
      name
      status
      facilityId
      notes
      completedAt
      completedBy
    }
    nextToken
  }
  listSpaces(filters: { tenantId: $tenantId, facilityId: $facilityId, floorId: $floorId}) {
    items {
      id
      createdAt
      createdBy
      currentVersion
      facilityId
      floorId
      name
      localName
      department
      type
      status
      notes
      completedAt
      completedBy
      availableDate
    }
    nextToken
  }
  listAssets(filters: {tenantId: $tenantId, facilityId: $facilityId, floorId: $floorId, spaceId: $spaceId}) {
    items {
      id
      createdAt
      createdBy
      currentVersion
      facilityId
      floorId
      spaceId
      assetType {
        description
        legacyId
        tree
        virtual
      }
      images {
        dataUri
        picture {
          bucket
          key
        }
      }
      facets
      notes
      projectId
      siteId
    }
    nextToken
  }

  listFormResponses(filters: {tenantId: $tenantId}) {
    items {
      id
      createdAt
      createdBy
      currentVersion
      formId
      response
    }
    nextToken
  }
}`
export const ListEliasInfo = gql(listEliasInfoQuery)

export const listProjectsQuery = `query listProjects($tenantId: String!) {
  listProjects(filters: { tenantId: $tenantId }) {
    items {
      id
      createdAt
      currentVersion
      sites
      name
      rag
      readonly
      preSurveyQuestionnaire
      docs {
        id
        text
      }
      code
    }
    nextToken
  }
}`
export const ListProjects = gql(listProjectsQuery)

export const listFacilitiesQuery = `query listFacilities($tenantId: String!) {
  listFacilities(filters: { tenantId: $tenantId }) {
    items {
      id
      createdAt
      currentVersion
      siteId
      name
      rag
      status
      docs {
        id
        text
      }
      facets
      notes
      images {
        dataUri
        picture {
          bucket
          key
        }
      }
      tenantId
      code
    }
    nextToken
  }
}`
export const ListFacilities = gql(listFacilitiesQuery)

export const listFloorsQuery = `query listFloors($tenantId: String!, $facilityId: ID) {
  listFloors(filters: { tenantId: $tenantId, facilityId: $facilityId }) {
    items {
      id
      createdAt
      currentVersion
      name
      status
      notes
      completedAt
      completedBy
    }
    nextToken
  }
}`
export const ListFloors = gql(listFloorsQuery)

export const listSpacesQuery = `query listSpaces($tenantId: String!, $facilityId: ID, $floorId: ID, $name: String) {
  listSpaces( filters: { tenantId: $tenantId, facilityId: $facilityId, floorId: $floorId, name: $name}) {
    items {
      id
      createdAt
      createdBy
      currentVersion
      facilityId
      floorId
      name
      localName
      department
      type
      status
      notes
      completedAt
      completedBy
      availableDate
    }
    nextToken
  }
}`
export const ListSpaces = gql(listSpacesQuery)

export const listAssetsQuery = `query listAssets($tenantId: String!, $facilityId: ID, $floorId: ID, $spaceId: ID, $assetType: AssetTypeInput) {
  listAssets(filters: { tenantId: $tenantId, facilityId: $facilityId, floorId: $floorId, spaceId: $spaceId, assetType: $assetType }) {
    items {
      id
      createdAt
      currentVersion
      facilityId
      floorId
      spaceId
      assetType {
        description
        legacyId
        tree
        virtual
      }
      images {
        dataUri
        picture {
          bucket
          key
        }
      }
      facets
      notes
      spons {
        lifecycle
        replacementCost
        totalReplacementCost
      }
    }
    nextToken
  }
}`
export const ListAssets = gql(listAssetsQuery)

export const listFormResponsesQuery = `query listFormResponses($tenantId: String!) {
  listFormResponses(filters: { tenantId: $tenantId }) {
    items {
      id
      createdAt
      createdBy
      currentVersion
      formId
      response
    }
    nextToken
  }
}`
export const ListFormResponses = gql(listFormResponsesQuery)
