const createProjectMutation = `mutation CreateProject($input: CreateProjectInput!) {
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

const updateProjectMutation = `mutation UpdateProject($input: UpdateProjectInput!) {
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

const createSiteMutation = `mutation CreateSite($input: CreateSiteInput!) {
  createSite(input: $input) {
    id
    createdAt
    currentVersion
    name
    postcode
    code
  }
}
`

const deleteSiteMutation = `mutation DeleteSite($input: DeleteSiteInput!) {
  deleteSite(input: $input) {
    id
    createdAt
    currentVersion
    name
    postcode
    code
  }
}`

const deleteProjectMutation = `mutation DeleteProject($input: DeleteProjectInput!) {
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

const createFacilityMutation = `mutation CreateFacility($input: CreateFacilityInput!) {
  createFacility(input: $input) {
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
    code
  }
}
`

const updateFacilityMutation = `mutation UpdateFacility($input: UpdateFacilityInput!) {
  updateFacility(input: $input) {
    id
    createdBy
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
    code
  }
}
`

const deleteFacilityMutation = `mutation DeleteFacility($input: DeleteFacilityInput!) {
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
    code
  }
}
`

const createAssetMutation = `mutation CreateAsset($input: CreateAssetInput!) {
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

const updateAssetMutation = `mutation UpdateAsset($input: UpdateAssetInput!) {
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
  }
}
`

const deleteAssetMutation = `mutation DeleteAsset($input: DeleteAssetInput!) {
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

const createFloorMutation = `mutation CreateFloor($input: CreateFloorInput!) {
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

const updateFloorMutation = `mutation UpdateFloor($input: UpdateFloorInput!) {
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

const deleteFloorMutation = `mutation DeleteFloor($input: DeleteFloorInput!) {
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

const createSpaceMutation = `mutation CreateSpace($input: CreateSpaceInput!) {
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

const updateSpaceMutation = `mutation UpdateSpace($input: UpdateSpaceInput!) {
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

const deleteSpaceMutation = `mutation DeleteSpace($input: DeleteSpaceInput!) {
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

const createFormResponseMutation = `mutation CreateFormResponse($input: CreateFormResponseInput!) {
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

const updateFormResponseMutation = `mutation UpdateFormResponse($input: UpdateFormResponseInput!) {
  updateFormResponse(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    formId
    response
  }
}`

const deleteFormResponseMutation = `mutation DeleteFormResponse($input: DeleteFormResponseInput!) {
  deleteFormResponse(input: $input) {
    id
    createdAt
    createdBy
    currentVersion
    formId
    response
  }
}
`

module.exports = {
  createProjectMutation,
  updateProjectMutation,
  deleteProjectMutation,
  createFacilityMutation,
  updateFacilityMutation,
  deleteFacilityMutation,
  createAssetMutation,
  updateAssetMutation,
  deleteAssetMutation,
  createFloorMutation,
  updateFloorMutation,
  deleteFloorMutation,
  createSpaceMutation,
  updateSpaceMutation,
  deleteSpaceMutation,
  createFormResponseMutation,
  updateFormResponseMutation,
  deleteFormResponseMutation,
  createSiteMutation,
  deleteSiteMutation,
}
