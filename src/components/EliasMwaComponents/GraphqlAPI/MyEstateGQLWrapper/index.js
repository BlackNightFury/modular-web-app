import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import { ListEliasInfo } from '@/graphql/queries'
import { makeDetailedAssets } from '@/services/asset'

const getMyEstateData = data => {
  const { listAssets, listFacilities, listSpaces, listFloors } = data

  return {
    assets: makeDetailedAssets(listAssets ? listAssets.items : []),
    facilities: listFacilities ? listFacilities.items : [],
    spaces: listSpaces ? listSpaces.items : [],
    floors: listFloors ? listFloors.items : [],
  }
}

const Wrapper = WrappedComponent => ownProps => {
  const { isDemo } = ownProps
  if (isDemo) {
    const {
      prototype: { listEliasInfo },
    } = ownProps

    return <WrappedComponent {...ownProps} {...getMyEstateData(listEliasInfo)} />
  }

  const {
    user: { tenantId },
  } = ownProps

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-and-network',
        variables: { tenantId },
      },
      props: ({ data }) => getMyEstateData(data),
    }),
  )(WrappedComponent)
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype }) => ({ user, prototype })
export default WrappedComponent => connect(mapStateToProps)(Wrapper(WrappedComponent))
