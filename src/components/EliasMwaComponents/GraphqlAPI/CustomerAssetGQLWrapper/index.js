import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import { ListEliasInfo } from '@/graphql/queries'
import { makeDetailedAssets } from '@/services/asset'

const getAssetDetail = (projects, facilities, floors, spaces, assets, assetNameEncoded) => {
  const detailedAssets = makeDetailedAssets(assets)
  const asset = detailedAssets.find(obj => obj.id.toLowerCase() === assetNameEncoded)

  const project = projects.find(obj => obj.id === asset.projectId)
  const facility = facilities.find(obj => obj.id === asset.facilityId)
  const floor = floors.find(obj => obj.id === asset.floorId)
  const space = spaces.find(obj => obj.id === asset.spaceId)
  return {
    asset,
    project: project.name,
    facility: facility.name,
    floor: floor.name,
    space: space.name,
  }
}

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  const {
    match: {
      params: { assetName: assetNameEncoded },
    },
  } = ownProps

  if (isDemo) {
    const {
      prototype: { listEliasInfo: data },
    } = ownProps

    const { asset } = getAssetDetail(
      data.listProjects ? data.listProjects.items : [],
      data.listFacilities ? data.listFacilities.items : [],
      data.listFloors ? data.listFloors.items : [],
      data.listSpaces ? data.listSpaces.items : [],
      data.listAssets ? data.listAssets.items : [],
      assetNameEncoded,
    )

    return <WrappedComponent {...ownProps} asset={asset} isDemo />
  }

  const {
    user: { tenantId },
  } = ownProps

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId },
      },
      props: ({ data }) =>
        getAssetDetail(
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listFloors ? data.listFloors.items : [],
          data.listSpaces ? data.listSpaces.items : [],
          data.listAssets ? data.listAssets.items : [],
          assetNameEncoded,
        ),
    }),
  )(WrappedComponent)
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype }) => ({ user, prototype })
export default (WrappedComponent, isDemo) =>
  connect(mapStateToProps)(Wrapper(WrappedComponent, isDemo))
