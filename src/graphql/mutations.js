import gql from 'graphql-tag'

// eslint-disable
// this is an auto generated file. This will be overwritten
export const createProjectMutation = `mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    createdAt
    currentVersion
    sites
    name
    rag
    preSurveyQuestionnaire
    docs {
      text,
      id
    }
    readonly
    code
  }
}
`
export const CreateProject = gql(createProjectMutation)

export const createSiteMutation = `mutation CreateSite($input: CreateSiteInput!) {
  createSite(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    name
    postcode
    code
  }
}
`
export const CreateSite = gql(createSiteMutation)

export const updateProjectMutation = `mutation UpdateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    id
    createdBy
    currentVersion
    sites
    name
    rag
    readonly
    code
  }
}
`
export const UpdateProject = gql(updateProjectMutation)

export const deleteProjectMutation = `mutation DeleteProject($input: DeleteProjectInput!) {
  deleteProject(input: $input) {
    id
    createdAt
    currentVersion
    sites
    name
    rag
    readonly
    code
  }
}
`
export const DeleteProject = gql(deleteProjectMutation)

export const createFacilityMutation = `mutation CreateFacility($input: CreateFacilityInput!) {
  createFacility(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    siteId
    name
    rag
    status
    facets
    notes
    docs {
      text,
      id
    }
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
}
`
export const CreateFacility = gql(createFacilityMutation)

export const updateFacilityMutation = `mutation UpdateFacility($input: UpdateFacilityInput!) {
  updateFacility(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    siteId
    name
    rag
    status
    docs {
      text,
      id
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
}
`
export const UpdateFacility = gql(updateFacilityMutation)

export const deleteFacilityMutation = `mutation DeleteFacility($input: DeleteFacilityInput!) {
  deleteFacility(input: $input) {
    id
    createdAt
    currentVersion
    siteId
    name
    rag
    docs {
      text,
      id
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
}
`
export const DeleteFacility = gql(deleteFacilityMutation)

export const createAssetMutation = `mutation CreateAsset($input: CreateAssetInput!) {
  createAsset(input: $input) {
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
}`
export const CreateAsset = gql(createAssetMutation)

export const createManufacturerMutation = `mutation CreateManufacturer($input: CreateManufacturerInput!) {
  createManufacturer(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    name
  }
}`
export const CreateManufacturer = gql(createManufacturerMutation)

export const updateAssetMutation = `mutation UpdateAsset($input: UpdateAssetInput!) {
  updateAsset(input: $input) {
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
    spons {
      lifecycle
      replacementCost
      totalReplacementCost
    }
  }
}
`
export const UpdateAsset = gql(updateAssetMutation)

export const deleteAssetMutation = `mutation DeleteAsset($input: DeleteAssetInput!) {
  deleteAsset(input: $input) {
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
}
`
export const DeleteAsset = gql(deleteAssetMutation)

export const deleteFloorMutation = `mutation DeleteFloor($input: DeleteFloorInput!) {
  deleteFloor(input: $input) {
    id
    createdAt
    currentVersion
    name
    status
    facilityId
    notes
  }
}
`
export const DeleteFloor = gql(deleteFloorMutation)

export const deleteSpaceMutation = `mutation DeleteSpace($input: DeleteSpaceInput!) {
  deleteSpace(input: $input) {
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
  }
}
`
export const DeleteSpace = gql(deleteSpaceMutation)

export const createFloorMutation = `mutation CreateFloor($input: CreateFloorInput!) {
  createFloor(input: $input) {
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
}
`
export const CreateFloor = gql(createFloorMutation)

export const createSpaceMutation = `mutation CreateSpace($input: CreateSpaceInput!) {
  createSpace(input: $input) {
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
}
`
export const CreateSpace = gql(createSpaceMutation)

export const createFormResponseMutation = `mutation CreateFormResponse($input: CreateFormResponseInput!) {
  createFormResponse(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    formId
    response
  }
}
`
export const CreateFormResponse = gql(createFormResponseMutation)

export const updateFormResponseMutation = `mutation UpdateFormResponse($input: UpdateFormResponseInput!) {
  updateFormResponse(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    formId
    response
  }
}`

export const UpdateFormResponse = gql(updateFormResponseMutation)

export const updateFloorMutation = `mutation UpdateFloor($input: UpdateFloorInput!) {
  updateFloor(input: $input) {
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
}
`
export const UpdateFloor = gql(updateFloorMutation)

export const updateSpaceMutation = `mutation UpdateSpace($input: UpdateSpaceInput!) {
  updateSpace(input: $input) {
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
}
`
export const UpdateSpace = gql(updateSpaceMutation)

export const generateReportMutation = `mutation GenerateReport($filters: ReportFiltersInput, $reportDetails: ReportDetailsInput) {
  generateReport(filters: $filters, reportDetails: $reportDetails) {
    reportDetails {
      id
      name
      format
      type
    }
    report {
      bucket
      key
      region
    }
  }
}
`

export const GenerateReport = gql(generateReportMutation)
