// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag'

export const onCreateSubscription = `subscription onCreateSubscription($facilityId: String!) {
  onCreateFloor(facilityId: $facilityId) {
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
  onCreateSpace(facilityId: $facilityId) {
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
  onCreateAsset(facilityId: $facilityId) {
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
export const onCreate = gql(onCreateSubscription)

export const onUpdateSubscription = `subscription onUpdateSubscription($facilityId: String!) {
  onUpdateFloor(facilityId: $facilityId) {
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
  onUpdateSpace(facilityId: $facilityId) {
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
  onUpdateAsset(facilityId: $facilityId) {
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
export const onUpdate = gql(onUpdateSubscription)

export const onDeleteSubscription = `subscription onDeleteSubscription($facilityId: String!) {
  onDeleteFloor(facilityId: $facilityId) {
    id
    createdAt
    currentVersion
    name
    status
    facilityId
    notes
  }
  onDeleteSpace(facilityId: $facilityId) {
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
  onDeleteAsset(facilityId: $facilityId) {
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
export const onDelete = gql(onDeleteSubscription)
