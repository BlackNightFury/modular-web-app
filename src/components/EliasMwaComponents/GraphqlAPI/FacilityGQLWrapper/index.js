import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import shortid from 'shortid'
import moment from 'moment'
import {
  makeURL,
  getAllLegacyProjectIds,
  getProjectFromEncoded,
  getConcatenatedUrl,
  checkIfReadOnlyFromParent,
  encodeURL,
} from '@/services/utils'
import {
  CreateFloor,
  UpdateFloor,
  DeleteFloor,
  CreateFormResponse,
  UpdateSpace,
  UpdateFacility,
} from '@/graphql/mutations'
import { GetSpaceTypes, ListEliasInfo, GetAssetsHierarchy } from '@/graphql/queries'
import { padWithZeros, makeDetailedAssets } from '@/services/asset'
import { getInstallDateFormat } from '@/services/asset-validation'

const { tenants } = window.mwa_config

const legacyProjectIds = getAllLegacyProjectIds(tenants)

const getFacilityDetails = (
  tenantId,
  projectNameEncoded,
  facilityNameEncoded,
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
  const floorsInfo = floors
    .filter(floor => floor.facilityId === facilityId)
    .map(floor => {
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

      return {
        project,
        ...floor,
        notes: floor.notes && JSON.parse(floor.notes),
        assets: subAssets.length,
        virtualAssets: subVAssets.length,
        spaces: subSpaces.length,
        subSpaces,
        subAssets,
      }
    })

  const facility = filteredFacilities[0] || {}
  const { readOnly, readOnlyReason } = checkIfReadOnlyFromParent(
    project,
    facility,
    formResponses,
    facilities,
    facilityPSQCompleted,
  )

  return {
    project,
    floors: floorsInfo,
    isVAInSpace: tenants[tenantId].virtual_asset_in_space,
    facility: {
      ...facility,
      facets: JSON.parse(facility.facets),
      notes: JSON.parse(facility.notes || '{}'),
    },
    readOnly,
    readOnlyReason,
  }
}

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  const {
    match: {
      params: { projectName: projectNameEncoded, facilityName: facilityNameEncoded },
    },
  } = ownProps

  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, tenantId, hierarchy, mandatoryTypes },
      dispatch,
      user: { facilityPSQCompleted },
    } = ownProps

    const { project, floors, facility, isVAInSpace, readOnly, readOnlyReason } = getFacilityDetails(
      tenantId,
      projectNameEncoded,
      facilityNameEncoded,
      data.listProjects ? data.listProjects.items : [],
      data.listFacilities ? data.listFacilities.items : [],
      data.listFloors ? data.listFloors.items : [],
      data.listSpaces ? data.listSpaces.items : [],
      data.listAssets ? data.listAssets.items : [],
      data.listFormResponses ? data.listFormResponses.items : [],
      facilityPSQCompleted,
    )

    const onAdd = (_, post) => {
      const formatedPost = {
        tenantId,
        id: shortid.generate(),
        facilityId: facility.id,
        createdAt: `${moment().toISOString()}`,
        createdBy: 'modular-web-application-js-datacollection-module',
        ...post,
        notes: JSON.stringify(post.notes),
      }

      dispatch({
        type: 'prototype/ADD_ASSET',
        payload: { asset: formatedPost, type: 'listFloors' },
      })

      return formatedPost
    }

    const onAddPreSurveyorResponse = (_, post) => {
      const formatedPost = {
        tenantId,
        id: shortid.generate(),
        createdAtClient: `${moment().toISOString()}`,
        createdBy: 'modular-web-application-js-datacollection-module',
        ...post,
      }

      return formatedPost
    }

    const onUpdate = post => {
      const {
        assets,
        virtualAssets,
        spaces,
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
        payload: { asset: formatedPost, type: 'listFloors' },
      })
    }

    const onUpdateConditionSurveyData = newConditionSurveyData => {
      dispatch({
        type: 'prototype/UPDATE_TREE_DATA',
        payload: { newData: newConditionSurveyData, type: 'listConditionSurveyData' },
      })
    }

    return (
      <WrappedComponent
        {...ownProps}
        floors={floors}
        project={project}
        facility={facility}
        onAdd={onAdd}
        onAddPreSurveyorResponse={onAddPreSurveyorResponse}
        onUpdate={onUpdate}
        onUpdateFacility={() => {}}
        isVAInSpace={isVAInSpace}
        readOnly={readOnly}
        showConditionSurvey
        cSurveyData={data.listConditionSurveyData}
        onUpdateConditionSurveyData={onUpdateConditionSurveyData}
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
        ...getFacilityDetails(
          tenantId,
          projectNameEncoded,
          facilityNameEncoded,
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
    graphql(CreateFloor, {
      options: {
        update: (dataProxy, { data: { createFloor } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)

          if (
            data.listFloors.items.find(
              post => post.facilityId === createFloor.facilityId && post.id === createFloor.id,
            )
          ) {
            return
          }

          data.listFloors.items.splice(0, 0, createFloor)
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onAdd: (facilityId, post) => {
          const formatedPost = {
            tenantId,
            id: shortid.generate(),
            facilityId,
            createdAtClient: `${moment().toISOString()}`,
            createdBy: 'modular-web-application-js-datacollection-module',
            ...post,
            notes: JSON.stringify(post.notes),
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              createFloor: {
                ...formatedPost,
                completedAt: `${moment().toISOString()}`,
                completedBy: null,
                createdAt: `${moment().toISOString()}`,
                currentVersion: 'v0001',
                __typename: 'Floor',
              },
            }),
          })

          return formatedPost
        },
      }),
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
        onUpdate: (post, isComplete) => {
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
        onDelete: post => {
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

          return formatedPost
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
    graphql(UpdateFacility, {
      options: {
        update: (dataProxy, { data: { updateFacility } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listFacilities.items.findIndex(
            item => item.id === updateFacility.id,
          )

          data.listFacilities.items[updatedIndex] = updateFacility
          dataProxy.writeQuery({ query, data, variables: { tenantId } })
        },
      },
      props: props => ({
        onUpdateFacility: post => {
          const {
            assets,
            createdAt,
            createdBy,
            createdUser,
            currentVersion,
            isCompleted,
            __typename,
            docs,
            images,
            facets,
            notes,
            project,
            ...updatedPost
          } = post

          facets['build-date'] = moment(facets['build-date'], getInstallDateFormat())
            .toDate()
            .toISOString()

          const version = `v${padWithZeros(parseInt(currentVersion.slice(1), 10) + 1, 4)}`
          const formatedPost = {
            ...updatedPost,
            docs: docs.map(doc => ({ id: doc.id, text: doc.text })),
            images: (images || []).map(image => ({
              dataUri: image.dataUri.startsWith('blob') ? null : image.dataUri,
              picture: {
                bucket: image.picture.bucket,
                key: image.picture.key,
              },
            })),
            facets: JSON.stringify(facets),
            notes: JSON.stringify(notes || {}),
            createdAtClient: moment().toISOString(),
            createdBy: 'modular-web-application-js-datacollection-module',
            version,
          }

          props.mutate({
            variables: {
              input: formatedPost,
            },
            optimisticResponse: () => ({
              updateFacility: {
                ...formatedPost,
                createdAt: `${moment().toISOString()}`,
                currentVersion: version,
                docs: formatedPost.docs.map(doc => ({ ...doc, __typename: 'Doc' })),
                images: (formatedPost.images || []).map(image => ({
                  ...image,
                  picture: {
                    ...image.picture,
                    __typename: 'S3Object',
                  },
                  __typename: 'AssetImage',
                })),
                __typename: 'Facility',
              },
            }),
          })
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
