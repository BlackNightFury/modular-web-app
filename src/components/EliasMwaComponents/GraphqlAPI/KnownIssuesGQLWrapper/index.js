import React from 'react'
import { connect } from 'dva'
import { graphql, compose } from 'react-apollo'
import moment from 'moment'
import { isClickablePrototype, makeHierarchyTree, getAllLegacyProjectIds } from '@/services/utils'
import { padWithZeros, makeDetailedAssets, createAssetInput } from '@/services/asset'
import { GetAssetsHierarchy, ListEliasInfo } from '@/graphql/queries'
import { UpdateAsset } from '@/graphql/mutations'

const { tenants } = window.mwa_config
const legacyProjectIds = getAllLegacyProjectIds(tenants)

const getAssetDetail = (tenantId, projects, facilities, floors, spaces, assets) => ({
  assets: makeDetailedAssets(assets),
  allRecords: {
    facilities,
    floors,
    spaces,
    assets: makeDetailedAssets(assets),
  },
  isVAInSpace: tenants[tenantId] ? tenants[tenantId].virtual_asset_in_space : true,
  projects,
})

const Wrapper = WrappedComponent => ownProps => {
  const isDemo = isClickablePrototype()
  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, tenantId, hierarchy },
    } = ownProps

    const { assets } = getAssetDetail(
      tenantId,
      data.listProjects ? data.listProjects.items : [],
      data.listFacilities ? data.listFacilities.items : [],
      data.listFloors ? data.listFloors.items : [],
      data.listSpaces ? data.listSpaces.items : [],
      data.listAssets ? data.listAssets.items : [],
    )

    const onUpdateAsset = post => {
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

    return (
      <WrappedComponent
        {...ownProps}
        assets={assets}
        onUpdateAsset={onUpdateAsset}
        treeData={makeHierarchyTree(hierarchy, false)}
      />
    )
  }

  const {
    user: { tenant, tenantId, isGlobal },
  } = ownProps

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId },
      },
      props: ({ data }) =>
        getAssetDetail(
          tenantId,
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listFloors ? data.listFloors.items : [],
          data.listSpaces ? data.listSpaces.items : [],
          data.listAssets ? data.listAssets.items : [],
        ),
    }),
    graphql(GetAssetsHierarchy, {
      options: {
        fetchPolicy: 'cache-only',
        variables: {
          projects: isGlobal
            ? legacyProjectIds
            : [{ tenantId, projectId: tenants[tenantId].legacy_project_id }],
        },
      },
      props: ({ data }) => {
        const hierarchy = data.getHierarchy ? JSON.parse(data.getHierarchy) : {}
        const projectIds = isGlobal ? legacyProjectIds : [tenants[tenantId].legacy_project_id]
        const hierarchyArrays = projectIds.reduce((result, projectId) => {
          const tempHierarchy = (hierarchy[`${projectId}`] || {}).hierarchy || []
          result = result.concat(tempHierarchy)
          return result
        }, [])
        return {
          treeData: makeHierarchyTree(hierarchyArrays, false, tenant.virtual_asset_in_space),
        }
      },
    }),
    graphql(UpdateAsset, {
      options: {
        update: (dataProxy, { data: { updateAsset } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listAssets.items.findIndex(
            post =>
              post.facilityId === updateAsset.facilityId &&
              post.floorId === updateAsset.floorId &&
              post.id === updateAsset.id,
          )
          data.listAssets.items[updatedIndex] = updateAsset
          dataProxy.writeQuery({ query, data, variables: { tenantId } })
        },
      },
      props: props => ({
        onUpdateAsset: post => {
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
                spaceId: null,
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
  )(WrappedComponent)
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype }) => ({ user, prototype })
export default (WrappedComponent, isDemo) =>
  connect(mapStateToProps)(Wrapper(WrappedComponent, isDemo))
