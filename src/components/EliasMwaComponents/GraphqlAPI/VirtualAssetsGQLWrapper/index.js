import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import shortid from 'shortid'
import moment from 'moment'
import {
  makeURL,
  makeHierarchyTree,
  makeHierarchySubType2SysTypeMap,
  getProjectFromEncoded,
  getConcatenatedUrl,
  checkIfReadOnlyFromParent,
} from '@/services/utils'
import { padWithZeros, makeDetailedAssets, createAssetInput } from '@/services/asset'
import { GetAssetsHierarchy, ListEliasInfo } from '@/graphql/queries'
import { CreateAsset, UpdateAsset, DeleteAsset, CreateFormResponse } from '@/graphql/mutations'
import { getInstallDateFormat } from '@/services/asset-validation'

const { tenants } = window.mwa_config

const getVirtualAssetDetail = (
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

  const filteredFacilities = facilities.filter(
    facility => makeURL(getConcatenatedUrl(facility.code, facility.name)) === facilityNameEncoded,
  )
  const facilityId = filteredFacilities.length > 0 ? filteredFacilities[0].id : undefined
  const filteredFloors = floors.filter(
    floor =>
      floor.facilityId === facilityId &&
      makeURL(getConcatenatedUrl(floor.id, floor.name)) === floorNameEncoded,
  )
  const floorId = filteredFloors.length > 0 ? filteredFloors[0].id : undefined
  const floorName = filteredFloors.length > 0 ? filteredFloors[0].name : undefined

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
    floorName,
    assets: makeDetailedAssets(
      assets.filter(
        asset => asset.facilityId === facilityId && asset.floorId === floorId && !asset.spaceId,
      ),
    ),
    allRecords: makeDetailedAssets(assets),
    facility: filteredFacilities.length > 0 ? filteredFacilities[0] : null,
    project,
    isVAInSpace: tenants[tenantId].virtual_asset_in_space,
    readOnly,
    readOnlyReason,
  }
}
const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  const {
    match: {
      params: { projectName, facilityName, floorName: floorNameEncoded },
    },
  } = ownProps

  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, tenantId, virtualHierarchy },
      dispatch,
      user: { facilityPSQCompleted },
    } = ownProps

    const {
      facilityId,
      floorId,
      assets,
      facility,
      project,
      floorName,
      isVAInSpace,
      readOnly,
      readOnlyReason,
    } = getVirtualAssetDetail(
      tenantId,
      projectName,
      facilityName,
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
        floorId,
        createdAt: `${moment().toISOString()}`,
        createdBy: 'modular-web-application-js-datacollection-module',
        ...post,
      }

      dispatch({
        type: 'prototype/ADD_ASSET',
        payload: { asset: formatedPost, type: 'listAssets' },
      })

      return formatedPost
    }

    const onUpdate = post => {
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

      dispatch({
        type: 'prototype/UPDATE_ASSET',
        payload: { asset: formatedPost, type: 'listAssets' },
      })
    }

    const onDelete = post => {
      const formatedPost = {
        tenantId,
        id: post.id,
        facilityId: post.facilityId,
        floorId: post.floorId,
      }

      dispatch({
        type: 'prototype/DELETE_ASSET',
        payload: { asset: formatedPost, type: 'listAssets' },
      })
    }

    return (
      <WrappedComponent
        {...ownProps}
        assets={assets}
        facilityId={facilityId}
        floorId={floorId}
        floorName={floorName}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        facility={facility}
        project={project}
        isVAInSpace={isVAInSpace}
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
        treeData={makeHierarchyTree(virtualHierarchy, false)}
        subType2SysType={makeHierarchySubType2SysTypeMap(virtualHierarchy)}
      />
    )
  }
  const {
    user: { currentTenantId: tenantId, tenantId: tenantOriginId, facilityPSQCompleted },
  } = ownProps

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId: tenantOriginId },
      },
      props: ({ data }) =>
        getVirtualAssetDetail(
          tenantId,
          projectName,
          facilityName,
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
          treeData: makeHierarchyTree(hierarchy.hierarchy || [], true),
          subType2SysType: makeHierarchySubType2SysTypeMap(hierarchy.hierarchy || []),
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
        onAdd: (facilityId, floorId, post) => {
          const images = post.images.map(image => ({
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
            tenantId,
            id: shortid.generate(),
            facilityId,
            floorId,
            createdAtClient: `${moment().toISOString()}`,
            createdBy: 'modular-web-application-js-datacollection-module',
          })
          props.mutate({
            variables: {
              input: formatedPost,
            },
            optimisticResponse: () => ({
              createAsset: {
                ...formatedPost,
                assetType: { ...formatedPost.assetType, __typename: 'AssetType' },
                spaceId: null,
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
              deleteAsset: { facilityId, floorId, id },
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
            post => !(post.facilityId === facilityId && post.floorId === floorId && post.id === id),
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
              post.id === updateAsset.id,
          )
          data.listAssets.items[updatedIndex] = updateAsset
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onUpdate: post => {
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

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => ({
              updateAsset: {
                ...formatedPost,
                assetType: { ...formatedPost.assetType, __typename: 'AssetType' },
                spons: post.spons,
                spaceId: null,
                images: typedImages,
                createdAt: `${moment().toISOString()}`,
                currentVersion: version,
                __typename: 'Asset',
              },
            }),
          })
        },
      }),
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
export default (WrappedComponent, isDemo) =>
  connect(mapStateToProps)(Wrapper(WrappedComponent, isDemo))
