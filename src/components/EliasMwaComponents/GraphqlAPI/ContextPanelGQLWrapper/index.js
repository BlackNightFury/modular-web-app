import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import moment from 'moment'
import { ListEliasInfo, GetAssetsHierarchy, GetSpaceTypes } from '@/graphql/queries'
import { UpdateFloor, UpdateSpace } from '@/graphql/mutations'
import {
  makeURL,
  encodeURL,
  getAllLegacyProjectIds,
  getProjectFromEncoded,
  getConcatenatedUrl,
  checkIfReadOnlyFromParent,
} from '@/services/utils'
import { checkIfFacilityCompleted } from '@/services/completion'
import { padWithZeros, makeDetailedAssets } from '@/services/asset'

const { tenants } = window.mwa_config
const legacyProjectIds = getAllLegacyProjectIds(tenants)

const getAssetsDetail = (
  tenantId,
  projectNameEncoded,
  facilityNameEncoded,
  floorNameEncoded,
  projects,
  facilities,
  floors,
  spaces,
  assets,
  formResponses,
  facilityPSQCompleted,
) => {
  const project = getProjectFromEncoded(projects, projectNameEncoded)

  const newFacilities = facilities.map(item => ({
    id: item.id,
    title: item.name,
    value: item.id,
    key: item.id,
    selectable: true,
    navUrl: getConcatenatedUrl(item.code, item.name),
  }))
  const mapFacilityId2Obj = {}
  newFacilities.forEach(item => {
    mapFacilityId2Obj[item.id] = item
  })

  const newFloors = floors.map(item => ({
    facilityId: item.facilityId,
    id: item.id,
    title: item.name,
    value: item.id,
    key: item.id,
    selectable: true,
    navUrl: getConcatenatedUrl(item.id, item.name),
  }))

  const mapFloorId2Obj = {}
  newFloors.forEach(item => {
    if (!mapFacilityId2Obj[item.facilityId]) {
      return
    }
    const { children } = mapFacilityId2Obj[item.facilityId]

    let newChildren = []
    if (children) newChildren = [...children, item]
    else newChildren = [item]

    mapFacilityId2Obj[item.facilityId].children = newChildren
    mapFloorId2Obj[item.id] = item
  })

  const newSpaces = spaces.map(item => ({
    floorId: item.floorId,
    id: item.id,
    title: item.name,
    value: item.id,
    key: item.id,
    selectable: true,
    navUrl: getConcatenatedUrl(item.id, item.name),
  }))

  newSpaces.forEach(item => {
    if (!mapFloorId2Obj[item.floorId]) {
      return
    }
    const { children } = mapFloorId2Obj[item.floorId]

    let newChildren = []
    if (children) newChildren = [...children, item]
    else newChildren = [item]

    mapFloorId2Obj[item.floorId].children = newChildren
  })

  if (!facilityNameEncoded) {
    // This is needed when the user is on homepage
    return {
      project,
      isVAInSpace: tenants[tenantId] && tenants[tenantId].virtual_asset_in_space,
      facilitiesInfo: newFacilities,
      assets: makeDetailedAssets(assets),
    }
  }
  const facility = facilities.find(
    item => makeURL(getConcatenatedUrl(item.code, encodeURL(item.name))) === facilityNameEncoded,
  )
  const facilityId = facility && facility.id

  const floor = floors.find(
    item =>
      item.facilityId === facilityId &&
      makeURL(getConcatenatedUrl(item.id, encodeURL(item.name))) === floorNameEncoded,
  )
  const floorId = floor && floor.id

  const subAssets = makeDetailedAssets(
    assets.filter(
      asset => asset.facilityId === facilityId && asset.floorId === floorId && asset.spaceId,
    ),
  )

  const subVAssets = makeDetailedAssets(
    assets.filter(
      asset => asset.facilityId === facilityId && asset.floorId === floorId && !asset.spaceId,
    ),
  )

  const subSpaces = spaces
    .filter(space => space.facilityId === facilityId && space.floorId === floorId)
    .map(space => ({
      ...space,
      notes: space.notes && JSON.parse(space.notes),
    }))

  const { readOnly, readOnlyReason } = checkIfReadOnlyFromParent(
    project,
    facility,
    formResponses,
    facilities,
    facilityPSQCompleted,
  )

  return {
    project,
    isVAInSpace: tenants[tenantId] && tenants[tenantId].virtual_asset_in_space,
    facilitiesInfo: newFacilities,
    currentFacility: facility,
    currentFacilityId: facilityId,
    currentFloor: floor && {
      ...floor,
      notes: floor.notes && JSON.parse(floor.notes),
      assets: subAssets.length,
      virtualAssets: subVAssets.length,
      spaces: subSpaces.length,
      subSpaces,
      subAssets,
    },
    assets,
    readOnly,
    readOnlyReason,
  }
}

const Wrapper = WrappedComponent => ownProps => {
  const {
    user: { authenticated, tenantId, authenticatedBy, isGlobal, facilityPSQCompleted },
    contentAreaNavigation: {
      project: projectNameEncoded,
      facility: facilityNameEncoded,
      floor: floorNameEncoded,
    },
    dispatch,
  } = ownProps

  if (authenticated && authenticatedBy === 'demo') {
    const {
      prototype: { listEliasInfo: data },
    } = ownProps
    const {
      project,
      facilitiesInfo,
      assets,
      readOnly,
      readOnlyReason,
      currentFacility,
      currentFacilityId,
      currentFloor,
    } = getAssetsDetail(
      tenantId,
      projectNameEncoded,
      facilityNameEncoded,
      floorNameEncoded,
      data.listProjects ? data.listProjects.items : [],
      data.listFacilities ? data.listFacilities.items : [],
      data.listFloors ? data.listFloors.items : [],
      data.listSpaces ? data.listSpaces.items : [],
      data.listAssets ? data.listAssets.items : [],
      data.listFormResponses ? data.listFormResponses.items : [],
      facilityPSQCompleted,
    )

    const allRecords = {
      facilities: data.listFacilities ? data.listFacilities.items : [],
      floors: data.listFloors ? data.listFloors.items : [],
      spaces: data.listSpaces ? data.listSpaces.items : [],
      assets: makeDetailedAssets(data.listAssets ? data.listAssets.items : []),
      formResponses: data.listFormResponses ? data.listFormResponses.items : [],
    }
    return (
      <WrappedComponent
        {...ownProps}
        project={project}
        allRecords={allRecords}
        facilitiesInfo={facilitiesInfo}
        assets={assets}
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
        currentFacility={currentFacility}
        currentFacilityId={currentFacilityId}
        currentFloor={currentFloor}
      />
    )
  }

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId },
      },
      props: ({ data }) => {
        const listFormResponses = data.listFormResponses ? data.listFormResponses.items : []
        const facilities = data.listFacilities ? data.listFacilities.items : []
        const isCompleted = checkIfFacilityCompleted(
          listFormResponses,
          facilities,
          facilityNameEncoded,
        )
        return {
          ...getAssetsDetail(
            tenantId,
            projectNameEncoded,
            facilityNameEncoded,
            floorNameEncoded,
            data.listProjects ? data.listProjects.items : [],
            facilities,
            data.listFloors ? data.listFloors.items : [],
            data.listSpaces ? data.listSpaces.items : [],
            data.listAssets ? data.listAssets.items : [],
            data.listFormResponses ? data.listFormResponses.items : [],
            facilityPSQCompleted,
          ),
          allRecords: {
            projects: data.listProjects ? data.listProjects.items : [],
            facilities: data.listFacilities ? data.listFacilities.items : [],
            floors: data.listFloors ? data.listFloors.items : [],
            spaces: data.listSpaces ? data.listSpaces.items : [],
            assets: makeDetailedAssets(data.listAssets ? data.listAssets.items : []),
            formResponses: data.listFormResponses ? data.listFormResponses.items : [],
          },
          isCompleted,
        }
      },
    }),
    graphql(UpdateFloor, {
      options: {
        update: (dataProxy, { data: { updateFloor } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listFloors.items.findIndex(
            post => post.facilityId === updateFloor.facilityId && post.id === updateFloor.id,
          )
          data.listFloors.items[updatedIndex] = updateFloor
          if (updateFloor.status === 'DONE') {
            data.listFloors.items[updatedIndex] = {
              ...data.listFloors.items[updatedIndex],
            }
            data.listSpaces.items = data.listSpaces.items.map(space => {
              if (space.facilityId === updateFloor.facilityId && space.floorId === updateFloor.id) {
                return {
                  ...space,
                  notes: JSON.stringify(space.notes),
                  status: 'DONE',
                  createdAt: updateFloor.createdAt,
                  completedAt: updateFloor.completedAt,
                  completedBy: updateFloor.completedBy,
                }
              }
              return space
            })
          }
          dataProxy.writeQuery({ query, data, variables: { tenantId } })
        },
      },
      props: props => ({
        onUpdateFloor: (post, isComplete) => {
          const { currentVersion } = post
          const version = `v${padWithZeros(parseInt(currentVersion.slice(1), 10) + 1, 4)}`
          const formatedPost = {
            tenantId,
            createdAtClient: moment().toISOString(),
            createdBy: 'modular-web-application-js-datacollection-module',
            version,
            facilityId: post.facilityId,
            id: post.id,
            name: post.name,
            notes: JSON.stringify(post.notes),
            status: post.status,
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => {
              if (isComplete) {
                dispatch({
                  type: 'completion/DATA_COMPLETED',
                  payload: { id: formatedPost.id, name: formatedPost.name },
                })
              }
              return {
                updateFloor: {
                  ...formatedPost,
                  createdAt: `${moment().toISOString()}`,
                  currentVersion: version,
                  completedAt:
                    post.status === 'DONE' ? `${moment().toISOString()}` : post.completedAt,
                  completedBy: post.status === 'DONE' ? formatedPost.createdBy : post.createdBy,
                  __typename: 'Floor',
                },
              }
            },
          })

          return formatedPost
        },
      }),
    }),
    graphql(UpdateSpace, {
      options: {
        update: (dataProxy, { data: { updateSpace } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listSpaces.items.findIndex(
            post =>
              post.facilityId === updateSpace.facilityId &&
              post.floorId === updateSpace.floorId &&
              post.id === updateSpace.id,
          )
          data.listSpaces.items[updatedIndex] = updateSpace
          dataProxy.writeQuery({ query, data, variables: { tenantId } })
        },
      },
      props: props => ({
        onUpdateSpace: post => {
          const {
            assets,
            tenantId: tenantIdImp,
            createdAt,
            createdAtClient,
            createdBy,
            createdUser,
            currentVersion,
            completedAt,
            completedBy,
            __typename,
            ...updatedPost
          } = post

          const version = `v${padWithZeros(parseInt(currentVersion.slice(1), 10) + 1, 4)}`
          const formatedPost = {
            ...updatedPost,
            notes: JSON.stringify(updatedPost.notes),
            tenantId,
            createdAtClient: moment().toISOString(),
            createdBy: 'modular-web-application-js-datacollection-module',
            version,
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              updateSpace: {
                availableDate: null,
                ...formatedPost,
                createdAt: `${moment().toISOString()}`,
                currentVersion: version,
                completedAt: post.completedAt,
                completedBy: post.completedBy,
                __typename: 'Space',
              },
            }),
          })
        },
      }),
    }),
    graphql(GetAssetsHierarchy, {
      options: {
        fetchPolicy: 'cache-only',
        variables: {
          projects: tenantId && [{ tenantId, projectId: tenants[tenantId].legacy_project_id }],
        },
      },
      props: ({ data }) => {
        if (!tenantId) {
          return {}
        }
        let hierarchy = data.getHierarchy ? JSON.parse(data.getHierarchy) : {}
        hierarchy = hierarchy[`${tenants[tenantId].legacy_project_id}`] || {}
        const treeData = hierarchy.hierarchy || []
        const hierarchyEnrichment = hierarchy.hierarchyEnrichment || {}
        const mandatoryTypes =
          (hierarchyEnrichment.asset_types && hierarchyEnrichment.asset_types.mandatory_types) || []
        return { treeData, mandatoryTypes }
      },
    }),
    graphql(GetSpaceTypes, {
      options: {
        fetchPolicy: 'cache-only',
        variables: {
          projects: isGlobal ? legacyProjectIds : tenantId && [tenants[tenantId].legacy_project_id],
        },
      },
      props: ({ data }) => {
        const spaceTypes = data.getSpaceTypes ? JSON.parse(data.getSpaceTypes) : {}
        return { spaceTypes }
      },
    }),
  )(WrappedComponent)
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype, contentAreaNavigation }) => ({
  user,
  prototype,
  contentAreaNavigation,
})
export default WrappedComponent => withRouter(connect(mapStateToProps)(Wrapper(WrappedComponent)))
