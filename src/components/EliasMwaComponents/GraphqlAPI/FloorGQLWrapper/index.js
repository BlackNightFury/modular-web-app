import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import moment from 'moment'
import shortid from 'shortid'
import {
  makeURL,
  getProjectFromEncoded,
  getAllLegacyProjectIds,
  getConcatenatedUrl,
  checkIfReadOnlyFromParent,
  encodeURL,
} from '@/services/utils'
import { padWithZeros, makeDetailedAssets } from '@/services/asset'
import { GetSpaceTypes, ListEliasInfo, GetAssetsHierarchy } from '@/graphql/queries'
import {
  CreateSpace,
  UpdateSpace,
  DeleteSpace,
  CreateFormResponse,
  UpdateFloor,
  DeleteFloor,
} from '@/graphql/mutations'

const { tenants } = window.mwa_config
const legacyProjectIds = getAllLegacyProjectIds(tenants)

const getFloorDetails = (
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

  const filteredFacilities = facilities.filter(
    facility =>
      makeURL(getConcatenatedUrl(facility.code, encodeURL(facility.name))) === facilityNameEncoded,
  )
  const facilityId = filteredFacilities.length > 0 ? filteredFacilities[0].id : undefined
  const filteredFloors = floors.filter(
    floor =>
      floor.facilityId === facilityId &&
      makeURL(getConcatenatedUrl(floor.id, encodeURL(floor.name))) === floorNameEncoded,
  )

  let floor = filteredFloors.length > 0 ? filteredFloors[0] : {}
  const subAssets = makeDetailedAssets(
    assets.filter(
      asset => asset.facilityId === facilityId && asset.floorId === floor.id && asset.spaceId,
    ),
  )
  const subVAssets = makeDetailedAssets(
    assets.filter(
      asset => asset.facilityId === facilityId && asset.floorId === floor.id && !asset.spaceId,
    ),
  )
  const subSpaces = spaces
    .filter(space => space.facilityId === facilityId && space.floorId === floor.id)
    .map(space => ({
      ...space,
      notes: space.notes && JSON.parse(space.notes),
    }))
  floor = {
    project,
    ...floor,
    notes: floor.notes && JSON.parse(floor.notes),
    assets: subAssets.length,
    virtualAssets: subVAssets.length,
    spaces: subSpaces.length,
    subSpaces,
    subAssets,
  }

  const facility = filteredFacilities[0] || {}
  const { readOnly, readOnlyReason } = checkIfReadOnlyFromParent(
    project,
    facility,
    formResponses,
    facilities,
    facilityPSQCompleted,
  )

  return {
    isVAInSpace: tenants[facility.tenantId].virtual_asset_in_space,
    project,
    facility,
    facilityId,
    floor,
    spaces: spaces
      .filter(space => space.facilityId === facilityId && space.floorId === floor.id)
      .map(space => ({
        projectName: project.name,
        floorName: floor.name,
        ...space,
        notes: space.notes && JSON.parse(space.notes),
        assets: assets.filter(
          asset =>
            asset.facilityId === facilityId &&
            asset.floorId === floor.id &&
            asset.spaceId === space.id,
        ).length,
      })),
    readOnly,
    readOnlyReason,
  }
}

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  const {
    match: {
      params: {
        projectName: projectNameEncoded,
        facilityName: facilityNameEncoded,
        floorName: floorNameEncoded,
      },
    },
  } = ownProps

  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, tenantId, spaceTypes, hierarchy, mandatoryTypes },
      dispatch,
      user: { facilityPSQCompleted },
    } = ownProps

    const {
      project,
      facility,
      spaces,
      facilityId,
      floor,
      readOnly,
      readOnlyReason,
    } = getFloorDetails(
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

    const onAdd = (_, __, post) => {
      const formatedPost = {
        tenantId,
        id: shortid.generate(),
        facilityId,
        floorId: floor.id,
        createdAt: `${moment().toISOString()}`,
        createdBy: 'modular-web-application-js-datacollection-module',
        ...post,
        notes: JSON.stringify(post.notes),
      }

      dispatch({
        type: 'prototype/ADD_ASSET',
        payload: { asset: formatedPost, type: 'listSpaces' },
      })

      return formatedPost
    }

    const onUpdate = post => {
      const {
        assets,
        tenantId: tenantIdImp,
        createdAt,
        createdAtClient,
        createdBy,
        createdUser,
        currentVersion,
        __typename,
        ...updatedPost
      } = post
      const formatedPost = {
        ...updatedPost,
        tenantId,
        createdAt: moment().toISOString(),
        createdBy: 'modular-web-application-js-datacollection-module',
        notes: JSON.stringify(post.notes),
      }

      dispatch({
        type: 'prototype/UPDATE_ASSET',
        payload: { asset: formatedPost, type: 'listSpaces' },
      })
    }

    return (
      <WrappedComponent
        {...ownProps}
        project={project}
        facility={facility}
        spaces={spaces}
        facilityId={facilityId}
        floor={floor}
        spaceTypes={spaceTypes}
        onAdd={onAdd}
        onUpdate={onUpdate}
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
        treeData={hierarchy}
        mandatoryTypes={mandatoryTypes}
      />
    )
  }

  const {
    user: { currentTenantId: tenantId, tenantId: tenantOriginId, isGlobal, facilityPSQCompleted },
    dispatch,
  } = ownProps

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId: tenantOriginId },
      },
      props: ({ data }) => ({
        ...getFloorDetails(
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
        ),
      }),
    }),
    graphql(CreateSpace, {
      options: {
        update: (dataProxy, { data: { createSpace } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)
          if (
            data.listSpaces.items.find(
              post =>
                post.facilityId === createSpace.facilityId &&
                post.floorId === createSpace.floorId &&
                post.id === createSpace.id,
            )
          ) {
            return
          }
          data.listSpaces.items.splice(0, 0, createSpace)
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onAdd: (facilityId, floorId, post) => {
          const formatedPost = {
            tenantId,
            id: shortid.generate(),
            facilityId,
            floorId,
            createdAtClient: `${moment().toISOString()}`,
            createdBy: 'modular-web-application-js-datacollection-module',
            ...post,
            notes: JSON.stringify(post.notes),
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              createSpace: {
                availableDate: null,
                ...formatedPost,
                createdAt: `${moment().toISOString()}`,
                currentVersion: 'v0001',
                completedAt: null,
                completedBy: null,
                __typename: 'Space',
              },
            }),
          })

          return formatedPost
        },
      }),
    }),
    graphql(DeleteSpace, {
      props: props => ({
        onDelete: post => {
          const formatedPost = {
            tenantId,
            id: post.id,
            facilityId: post.facilityId,
            floorId: post.floorId,
            version: `v${padWithZeros(parseInt(post.currentVersion.slice(1), 10) + 1, 4)}`,
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              deleteSpace: post,
            }),
          })

          return formatedPost
        },
      }),
      options: {
        update: (
          dataProxy,
          {
            data: {
              deleteSpace: { facilityId, floorId, id },
            },
          },
        ) => {
          const query = ListEliasInfo
          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)

          data.listSpaces.items = data.listSpaces.items.filter(
            post => !(post.facilityId === facilityId && post.floorId === floorId && post.id === id),
          )
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
    }),
    graphql(GetAssetsHierarchy, {
      options: {
        fetchPolicy: 'cache-only',
        variables: {
          projects: [{ tenantId, projectId: tenants[tenantId].legacy_project_id }],
        },
      },
      props: ({ data }) => {
        let hierarchy = data.getHierarchy ? JSON.parse(data.getHierarchy) : {}
        hierarchy = hierarchy[`${tenants[tenantId].legacy_project_id}`] || {}
        const treeData = hierarchy.hierarchy || []
        const hierarchyEnrichment = hierarchy.hierarchyEnrichment || {}
        const mandatoryTypes =
          (hierarchyEnrichment.asset_types && hierarchyEnrichment.asset_types.mandatory_types) || []

        return { treeData, mandatoryTypes }
      },
    }),
    graphql(UpdateSpace, {
      options: {
        update: (dataProxy, { data: { updateSpace } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listSpaces.items.findIndex(
            post =>
              post.facilityId === updateSpace.facilityId &&
              post.floorId === updateSpace.floorId &&
              post.id === updateSpace.id,
          )
          data.listSpaces.items[updatedIndex] = updateSpace
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onUpdate: post => {
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
    graphql(GetSpaceTypes, {
      options: {
        fetchPolicy: 'cache-only',
        variables: {
          projects: isGlobal ? legacyProjectIds : [tenants[tenantId].legacy_project_id],
        },
      },
      props: ({ data }) => {
        const spaceTypes = data.getSpaceTypes ? JSON.parse(data.getSpaceTypes) : {}
        return { spaceTypes }
      },
    }),
    graphql(UpdateFloor, {
      options: {
        update: (dataProxy, { data: { updateFloor } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
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
              if (
                space.facilityId === updateFloor.facilityId &&
                space.floorId === updateFloor.id &&
                space.status !== 'INACCESSIBLE'
              ) {
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
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
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
    graphql(DeleteFloor, {
      props: props => ({
        onDeleteFloor: post => {
          const formatedPost = {
            tenantId,
            id: post.id,
            facilityId: post.facilityId,
            version: `v${padWithZeros(parseInt(post.currentVersion.slice(1), 10) + 1, 4)}`,
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              deleteFloor: post,
            }),
          })
        },
      }),
      options: {
        update: (
          dataProxy,
          {
            data: {
              deleteFloor: { facilityId, id },
            },
          },
        ) => {
          const query = ListEliasInfo
          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)

          data.listFloors.items = data.listFloors.items.filter(
            post => !(post.facilityId === facilityId && post.id === id),
          )
          data.listSpaces.items = data.listSpaces.items.filter(
            post => !(post.facilityId === facilityId && post.floorId === id),
          )
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
    }),
    graphql(CreateFormResponse, {
      props: props => ({
        onAddPreSurveyorResponse: post => {
          const formatedPost = {
            tenantId,
            id: shortid.generate(),
            createdAtClient: `${moment().toISOString()}`,
            createdBy: 'modular-web-application-js-datacollection-module',
            ...post,
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              createFormResponse: {
                ...formatedPost,
                createdAt: `${moment().toISOString()}`,
                currentVersion: 'v0001',
                __typename: 'FormResponse',
              },
            }),
          })

          // add form_id in user object
          const {
            ownProps: { facility },
          } = props
          dispatch({
            type: 'user/SET_STATE',
            payload: {
              facilityPSQCompleted: [
                ...facilityPSQCompleted,
                { facilityId: facility.id, formId: formatedPost.id },
              ],
            },
          })

          return formatedPost
        },
      }),
    }),
  )(WrappedComponent)

  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype }) => ({ user, prototype })
export default (WrappedComponent, isDemo) =>
  connect(mapStateToProps)(Wrapper(WrappedComponent, isDemo))
