import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import shortid from 'shortid'
import moment from 'moment'
import _ from 'lodash'
import { GetAssetsHierarchy, ListEliasInfo, GetSpaceTypes } from '@/graphql/queries'
import {
  makeURL,
  makeHierarchyTree,
  getConcatenatedUrl,
  checkIfReadOnlyFromParent,
  encodeURL,
  getAllLegacyProjectIds,
} from '@/services/utils'
import { padWithZeros, createAssetInput, makeDetailedAssets } from '@/services/asset'
import {
  CreateAsset,
  UpdateAsset,
  DeleteAsset,
  CreateFormResponse,
  UpdateSpace,
  DeleteSpace,
} from '@/graphql/mutations'
import { qaHelper } from '@/services/task'
import { getInstallDateFormat } from '@/services/asset-validation'

const { tenants } = window.mwa_config
const legacyProjectIds = getAllLegacyProjectIds(tenants)

const getUntaggedAssetsDetail = (
  projectNameEncoded,
  facilityNameEncoded,
  sites,
  projects,
  facilities,
  floors,
  spaces,
  assets,
  formResponses,
  facilityPSQCompleted,
) => {
  const project =
    projects.find(
      obj => makeURL(getConcatenatedUrl(obj.code, encodeURL(obj.name))) === projectNameEncoded,
    ) || {}

  const facility =
    facilities.find(
      obj => makeURL(getConcatenatedUrl(obj.code, encodeURL(obj.name))) === facilityNameEncoded,
    ) || {}

  const { readOnly, readOnlyReason } = checkIfReadOnlyFromParent(
    project,
    facility,
    formResponses,
    facilities,
    facilityPSQCompleted,
  )

  return {
    assets: assets
      .filter(
        asset =>
          asset.projectId === project.id && asset.facilityId === facility.id && !!asset.spaceId,
      )
      .map(asset => {
        const floor = _.find(floors, { id: asset.floorId })
        const space = _.find(spaces, { id: asset.spaceId })

        if (!floor || !space) return {}
        return {
          ...asset,
          type: `${asset.assetType.description}-${asset.assetType.legacyId}`,
          location: `${facility.name}, ${floor.name}, ${space.name}`,
          facets: JSON.parse(asset.facets),
          notes: JSON.parse(asset.notes),
        }
      })
      .filter(asset => asset.notes && asset.notes.barcode && asset.notes.barcode.status),
    allRecords: {
      sites,
      facilities,
      floors,
      spaces,
      assets: makeDetailedAssets(assets),
    },
    project,
    facility,
    facilityId: facility.id,
    readOnly,
    readOnlyReason,
  }
}

const getSpaceDetail = (
  tenantId,
  projectNameEncoded,
  facilityNameEncoded,
  floorNameEncoded,
  spaceNameEncoded,
  sites,
  projects,
  facilities,
  floors,
  spaces,
  assets,
  formResponses,
  facilityPSQCompleted,
) => {
  const filteredProjects = projects.filter(
    project =>
      makeURL(getConcatenatedUrl(project.code, encodeURL(project.name))) === projectNameEncoded,
  )
  const project = filteredProjects.length > 0 ? filteredProjects[0] : {}

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
  const floorId = filteredFloors.length > 0 ? filteredFloors[0].id : undefined
  const filteredSpaces = spaces.filter(
    space =>
      space.facilityId === facilityId &&
      space.floorId === floorId &&
      makeURL(getConcatenatedUrl(space.id, encodeURL(space.name))) === spaceNameEncoded,
  )

  const space = filteredSpaces.length > 0 ? filteredSpaces[0] : {}

  const facility = filteredFacilities[0] || {}
  const { readOnly, readOnlyReason } = checkIfReadOnlyFromParent(
    project,
    facility,
    formResponses,
    facilities,
    facilityPSQCompleted,
  )
  return {
    facilityId,
    floorId,
    space,
    assets: makeDetailedAssets(
      assets.filter(
        asset =>
          asset.facilityId === facilityId &&
          asset.floorId === floorId &&
          asset.spaceId === space.id,
      ),
    ),
    allRecords: {
      sites,
      facilities,
      floors,
      spaces,
      assets: makeDetailedAssets(assets),
    },
    facility: filteredFacilities.length > 0 ? filteredFacilities[0] : null,
    project,
    isVAInSpace: tenants[tenantId].virtual_asset_in_space,
    readOnly,
    readOnlyReason,
  }
}

const Wrapper = (WrappedComponent, isDemo, options) => ownProps => {
  const {
    match: {
      params: { projectName, facilityName, floorName, spaceName: spaceNameEncoded },
    },
  } = ownProps

  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, tenantId, hierarchy },
      dispatch,
      user: { facilityPSQCompleted },
    } = ownProps

    const detail =
      options && options.untagged
        ? getUntaggedAssetsDetail(
            projectName,
            facilityName,
            data.listSites ? data.listSites.items : [],
            data.listProjects ? data.listProjects.items : [],
            data.listFacilities ? data.listFacilities.items : [],
            data.listFloors ? data.listFloors.items : [],
            data.listSpaces ? data.listSpaces.items : [],
            data.listAssets ? data.listAssets.items : [],
            data.listFormResponses ? data.listFormResponses.items : [],
            facilityPSQCompleted,
          )
        : getSpaceDetail(
            tenantId,
            projectName,
            facilityName,
            floorName,
            spaceNameEncoded,
            data.listSites ? data.listSites.items : [],
            data.listProjects ? data.listProjects.items : [],
            data.listFacilities ? data.listFacilities.items : [],
            data.listFloors ? data.listFloors.items : [],
            data.listSpaces ? data.listSpaces.items : [],
            data.listAssets ? data.listAssets.items : [],
            data.listFormResponses ? data.listFormResponses.items : [],
            facilityPSQCompleted,
          )

    const onAdd = (facilityId, floorId, spaceId, post, allRecords) => {
      const formatedPost = {
        tenantId,
        id: shortid.generate(),
        facilityId,
        floorId,
        spaceId,
        createdAt: `${moment().toISOString()}`,
        createdBy: 'modular-web-application-js-datacollection-module',
        ...post,
      }

      qaHelper(formatedPost, allRecords, false, 'asset')

      dispatch({
        type: 'prototype/ADD_ASSET',
        payload: { asset: formatedPost, type: 'listAssets' },
      })

      return formatedPost
    }

    const onUpdate = (post, allRecords) => {
      const {
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
        createdAt: `${moment().toISOString()}`,
        createdBy: 'modular-web-application-js-datacollection-module',
      }

      qaHelper(post, allRecords, true, 'asset')

      dispatch({
        type: 'prototype/UPDATE_ASSET',
        payload: { asset: formatedPost, type: 'listAssets' },
      })
    }

    const onDelete = (post, allRecords) => {
      const formatedPost = {
        tenantId,
        id: post.id,
        facilityId: post.facilityId,
        floorId: post.floorId,
        spaceId: post.spaceId,
      }
      qaHelper(formatedPost, allRecords, true, 'asset')

      dispatch({
        type: 'prototype/DELETE_ASSET',
        payload: { asset: formatedPost, type: 'listAssets' },
      })
    }

    return (
      <WrappedComponent
        {...ownProps}
        {...detail}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        treeData={makeHierarchyTree(hierarchy, false)}
      />
    )
  }

  const {
    user: { currentTenantId: tenantId, tenantId: tenantOriginId, facilityPSQCompleted, isGlobal },
  } = ownProps

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId: tenantOriginId },
      },
      props: ({ data }) =>
        options && options.untagged
          ? getUntaggedAssetsDetail(
              projectName,
              facilityName,
              data.listSites ? data.listSites.items : [],
              data.listProjects ? data.listProjects.items : [],
              data.listFacilities ? data.listFacilities.items : [],
              data.listFloors ? data.listFloors.items : [],
              data.listSpaces ? data.listSpaces.items : [],
              data.listAssets ? data.listAssets.items : [],
              data.listFormResponses ? data.listFormResponses.items : [],
              facilityPSQCompleted,
            )
          : getSpaceDetail(
              tenantId,
              projectName,
              facilityName,
              floorName,
              spaceNameEncoded,
              data.listSites ? data.listSites.items : [],
              data.listProjects ? data.listProjects.items : [],
              data.listFacilities ? data.listFacilities.items : [],
              data.listFloors ? data.listFloors.items : [],
              data.listSpaces ? data.listSpaces.items : [],
              data.listAssets ? data.listAssets.items : [],
              data.listFormResponses ? data.listFormResponses.items : [],
              facilityPSQCompleted,
            ),
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
        return {
          treeData: makeHierarchyTree(
            hierarchy.hierarchy || [],
            false,
            tenants[tenantId].virtual_asset_in_space,
          ),
        }
      },
    }),
    graphql(CreateAsset, {
      options: {
        update: (dataProxy, { data: { createAsset } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)
          if (
            data.listAssets.items.find(
              post =>
                post.facilityId === createAsset.facilityId &&
                post.floorId === createAsset.floorId &&
                post.spaceId === createAsset.spaceId &&
                post.id === createAsset.id,
            )
          ) {
            return
          }
          data.listAssets.items.splice(0, 0, createAsset)
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onAdd: (facilityId, floorId, spaceId, post, allRecords) => {
          const images = post.images.map(image => ({
            dataUri: image.dataUri,
            picture: image.picture ? { ...image.picture, __typename: 'S3Object' } : undefined,
            __typename: 'AssetImage',
          }))

          post.facets['install-date'] = moment(post.facets['install-date'], getInstallDateFormat())
            .toDate()
            .toISOString()

          const { barcode } = post.facets
          if (barcode) {
            const { dispatch } = props.ownProps
            dispatch({
              type: 'user/SET_STATE',
              payload: { lastBarcode: barcode },
            })
          }

          delete post.assetType.__typename

          const formatedPost = createAssetInput({
            ...post,
            tenantId,
            id: shortid.generate(),
            facilityId,
            floorId,
            spaceId,
            createdAtClient: `${moment().toISOString()}`,
            createdBy: 'modular-web-application-js-datacollection-module',
          })

          qaHelper(formatedPost, allRecords, false, 'asset')

          props.mutate({
            variables: {
              input: formatedPost,
            },
            optimisticResponse: () => ({
              createAsset: {
                ...formatedPost,
                assetType: { ...formatedPost.assetType, __typename: 'AssetType' },
                images,
                spons: null,
                createdAt: `${moment().toISOString()}`,
                currentVersion: 'v0001',
                __typename: 'Asset',
              },
            }),
          })

          return formatedPost
        },
      }),
    }),
    graphql(DeleteAsset, {
      props: props => ({
        onDelete: (post, allRecords) => {
          const formatedPost = {
            tenantId,
            id: post.id,
            facilityId: post.facilityId,
            floorId: post.floorId,
            spaceId: post.spaceId,
            version: `v${padWithZeros(parseInt(post.currentVersion.slice(1), 10) + 1, 4)}`,
          }

          qaHelper(post, allRecords, true, 'false')

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              deleteAsset: post,
            }),
          })
        },
      }),
      options: {
        update: (
          dataProxy,
          {
            data: {
              deleteAsset: { facilityId, floorId, spaceId, id },
            },
          },
        ) => {
          const query = ListEliasInfo
          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)

          data.listAssets.items = data.listAssets.items.filter(
            post =>
              !(
                post.facilityId === facilityId &&
                post.floorId === floorId &&
                post.spaceId === spaceId &&
                post.id === id
              ),
          )
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
    }),
    graphql(UpdateAsset, {
      options: {
        update: (dataProxy, { data: { updateAsset } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listAssets.items.findIndex(
            post =>
              post.facilityId === updateAsset.facilityId &&
              post.floorId === updateAsset.floorId &&
              post.spaceId === updateAsset.spaceId &&
              post.id === updateAsset.id,
          )
          data.listAssets.items[updatedIndex] = updateAsset
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onUpdate: (post, allRecords) => {
          const version = `v${padWithZeros(parseInt(post.currentVersion.slice(1), 10) + 1, 4)}`

          const images = post.images.map(image => ({
            dataUri: image.dataUri,
            picture: image.picture ? { ...image.picture, __typename: undefined } : undefined,
            __typename: undefined,
          }))

          const typedImages = post.images.map(image => ({
            dataUri: image.dataUri,
            picture: image.picture ? { ...image.picture, __typename: 'S3Object' } : undefined,
            __typename: 'AssetImage',
          }))

          post.facets['install-date'] = moment(post.facets['install-date'], getInstallDateFormat())
            .toDate()
            .toISOString()
          delete post.assetType.__typename

          const formatedPost = createAssetInput({
            ...post,
            images,
            tenantId,
            createdAtClient: `${moment().toISOString()}`,
            createdBy: 'modular-web-application-js-datacollection-module',
            version,
          })

          qaHelper(formatedPost, allRecords, true, 'asset')

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              updateAsset: {
                ...formatedPost,
                spons: post.spons,
                images: typedImages,
                assetType: { ...formatedPost.assetType, __typename: 'AssetType' },
                createdAt: `${moment().toISOString()}`,
                currentVersion: version,
                __typename: 'Asset',
              },
            }),
          })
        },
      }),
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
    graphql(DeleteSpace, {
      props: props => ({
        onDeleteSpace: post => {
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
            ownProps: { facility, dispatch },
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
export default (WrappedComponent, isDemo, options) => {
  class StoreWrapper extends React.Component {
    shouldComponentUpdate(nextProps) {
      const { user: nextUser } = nextProps
      const { user: currUser } = this.props
      if (nextUser.lastBarcode !== currUser.lastBarcode) {
        return false
      }
      return true
    }

    render() {
      const WrapperComponent = Wrapper(WrappedComponent, isDemo, options)
      return <WrapperComponent {...this.props} />
    }
  }
  return connect(mapStateToProps)(StoreWrapper)
}
