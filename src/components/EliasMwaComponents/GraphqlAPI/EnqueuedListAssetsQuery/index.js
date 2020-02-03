import React from 'react'
import { connect } from 'dva'
import { Query, withApollo } from 'react-apollo'
import { ListEliasInfo } from '@/graphql/queries'
import { cacheDocs } from '@/utils/sw-helper'

const { sync } = window.mwa_config

const mapStateToProps = ({ user }) => ({ authUser: user })

@connect(mapStateToProps)
class EnqueuedListAssetsQuery extends React.Component {
  state = {
    enqueuedMutations: -1,
  }

  async componentWillMount() {
    const { client } = this.props
    this.store = client.cache.store
    this.unsubscribeClientStore = this.store.subscribe(this.onSubscribeAWSAppsync)
  }

  componentWillUnmount() {
    if (this.clientStoreSubscription) {
      this.unsubscribeClientStore.unsubscribe()
    }
  }

  onSubscribeAWSAppsync = () => {
    const state = this.store.getState()
    const {
      'appsync-metadata': {
        snapshot: { enqueuedMutations },
      },
    } = state

    this.setState({ enqueuedMutations })
  }

  getAppSyncPollInterval = () => {
    const { enqueuedMutations } = this.state
    if (enqueuedMutations === 0) {
      return sync && sync.refresh_time ? sync.refresh_time * 1000 : 60000
    }
    return null
  }

  render() {
    const {
      children,
      authUser: { tenantId },
    } = this.props
    return (
      <Query query={ListEliasInfo} fetchPolicy="cache-and-network" variables={{ tenantId }}>
        {({ loading, error, data }) => {
          if (!loading && !error && data) {
            cacheDocs(data)
          }
          return children
        }}
      </Query>
    )
  }
}

export default withApollo(EnqueuedListAssetsQuery)
