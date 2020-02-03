const getAssetsHierarchyQuery = `query getHierarchy($projects: [ProjectInput]!)  {
  getHierarchy(projects: $projects)
}`

const getManufacturersQuery = `query getManufacturers($tenantId: String!)  {
  getManufacturers(tenantId: $tenantId)
}`

const getSpaceTypesQuery = `query getSpaceTypes($projects: [Int]!)  {
  getSpaceTypes(projects: $projects)
}`

const listEliasInfoQuery = `query listEliasInfo($tenantId: String!, $facilityId: ID, $floorId: ID, $spaceId: ID) {
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
  listFacilities(filters: {tenantId: $tenantId}) {
    items {
      id
      createdAt
      currentVersion
      siteId
      name
      rag
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

const listProjectsQuery = `query listProjects($tenantId: String!) {
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

const listFacilitiesQuery = `query listFacilities($tenantId: String!) {
  listFacilities(filters: { tenantId: $tenantId }) {
    items {
      id
      createdAt
      currentVersion
      siteId
      name
      rag
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
      code
    }
    nextToken
  }
}`

const listFloorsQuery = `query listFloors($tenantId: String!, $facilityId: ID) {
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

const listSpacesQuery = `query listSpaces($tenantId: String!, $facilityId: ID, $floorId: ID, $name: String) {
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

const listAssetsQuery = `query listAssets($tenantId: String!, $facilityId: ID, $floorId: ID, $spaceId: ID) {
  listAssets(filters: { tenantId: $tenantId, facilityId: $facilityId, floorId: $floorId, spaceId: $spaceId }) {
    items {
      id
      createdAt
      currentVersion
      facilityId
      floorId
      spaceId
      images {
        dataUri
        picture {
          bucket
          key
        }
      }
      facets
      notes
    }
    nextToken
  }
}`

const listFormResponsesQuery = `query listFormResponses($tenantId: String!) {
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

const listSitesQuery = `query listSites($tenantId: String!) {
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
}`

module.exports = {
  getAssetsHierarchyQuery,
  getManufacturersQuery,
  getSpaceTypesQuery,
  listEliasInfoQuery,
  listProjectsQuery,
  listFacilitiesQuery,
  listFloorsQuery,
  listSpacesQuery,
  listAssetsQuery,
  listFormResponsesQuery,
  listSitesQuery,
}
