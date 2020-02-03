import React from 'react'
import { BackTop, Layout, Row, Col } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import _ from 'lodash'
import API, { graphqlOperation } from '@aws-amplify/api'
import { withRouter } from 'dva/router'
import classNames from 'classnames'
import { withApollo, Query } from 'react-apollo'
import TopBar from '@/components/EliasMwaComponents/Navigation/TopBar'
import Menu from '@/components/EliasMwaComponents/Navigation/Menu'
import ErrorBoundary from '@/components/EliasMwaComponents/Host/ErrorBoundary'
import { ListEliasInfo, ListFacilities } from '@/graphql/queries'
import { makeURL, getConcatenatedUrl } from '@/services/utils'
import {
  onCreateSubscription,
  onUpdateSubscription,
  onDeleteSubscription,
} from '@/graphql/subscriptions'

import styles from './style.scss'

const { tenants } = window.mwa_config

const mapStateToProps = ({ settings, user }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
  isMenuCollapsed: settings.isMenuCollapsed,
  user,
})

@withRouter
@connect(mapStateToProps)
class EliasMwaLayout extends React.PureComponent {
  subscriptions = {}

  componentDidMount() {
    const {
      client: awsAppSyncClient,
      user: { authenticatedBy },
    } = this.props
    if (authenticatedBy !== 'demo') {
      this.unSubscriber = awsAppSyncClient.cache.store.subscribe(this.appsyncStoreChanged)
      this.appsyncStoreChanged()
      this.updateOffset()
      this.updateOffsetTimer = setInterval(this.updateOffset, 60000)
    }
  }

  componentWillUnmount() {
    const {
      user: { authenticatedBy },
    } = this.props
    if (authenticatedBy !== 'demo') {
      clearInterval(this.updateOffsetTimer)
      this.unSubscriber()
      this.removeAllSubscriptions()
    }
  }

  createSubscription = (facilityId, retrying = 0) => {
    const {
      client: awsAppSyncClient,
      user: { tenantId },
    } = this.props
    if (!this.subscriptions[facilityId] || this.subscriptions[facilityId].onCreate) {
      return
    }

    setTimeout(() => {
      this.subscriptions[facilityId].onCreate = API.graphql(
        graphqlOperation(onCreateSubscription, {
          facilityId,
        }),
      ).subscribe({
        next: ({
          value: {
            data: { onCreateFloor, onCreateSpace, onCreateAsset },
          },
        }) => {
          retrying = 0
          let fieldKey
          let createdRecord
          if (onCreateFloor) {
            fieldKey = 'listFloors'
            createdRecord = onCreateFloor
          }
          if (onCreateSpace) {
            fieldKey = 'listSpaces'
            createdRecord = onCreateSpace
          }
          if (onCreateAsset) {
            fieldKey = 'listAssets'
            createdRecord = onCreateAsset
          }

          if (!fieldKey) {
            return
          }

          const listEliasRequest = {
            query: ListEliasInfo,
            variables: { tenantId },
          }
          const data = _.cloneDeep(awsAppSyncClient.readQuery(listEliasRequest))
          if (data[fieldKey].items.find(item => item.id === createdRecord.id)) {
            return
          }

          data[fieldKey].items.splice(0, 0, createdRecord)
          awsAppSyncClient.writeQuery({
            query: ListEliasInfo,
            data,
            variables: { tenantId },
          })
        },
        error: data => {
          const { errors } = data
          if (errors && errors.find(error => error.message === 'Network Error')) {
            this.subscriptions[facilityId].onCreate.unsubscribe()
            delete this.subscriptions[facilityId].onCreate
            if (retrying === 0) {
              retrying = 50
            }
            this.createSubscription(facilityId, retrying * 2)
          }
        },
      })
    }, retrying)
  }

  updateSubscription = (facilityId, retrying = 0) => {
    const {
      client: awsAppSyncClient,
      user: { tenantId },
    } = this.props
    if (!this.subscriptions[facilityId] || this.subscriptions[facilityId].onUpdate) {
      return
    }

    setTimeout(() => {
      this.subscriptions[facilityId].onUpdate = API.graphql(
        graphqlOperation(onUpdateSubscription, {
          facilityId,
        }),
      ).subscribe({
        next: ({
          value: {
            data: { onUpdateFloor, onUpdateSpace, onUpdateAsset },
          },
        }) => {
          retrying = 0
          let fieldKey
          let updatedRecord
          if (onUpdateFloor) {
            fieldKey = 'listFloors'
            updatedRecord = onUpdateFloor
          }
          if (onUpdateSpace) {
            fieldKey = 'listSpaces'
            updatedRecord = onUpdateSpace
          }
          if (onUpdateAsset) {
            fieldKey = 'listAssets'
            updatedRecord = onUpdateAsset
          }

          if (!fieldKey) {
            return
          }

          const listEliasRequest = {
            query: ListEliasInfo,
            variables: { tenantId },
          }
          const data = _.cloneDeep(awsAppSyncClient.readQuery(listEliasRequest))
          const updatedIndex = data[fieldKey].items.findIndex(item => item.id === updatedRecord.id)
          if (updatedIndex < 0) {
            return
          }

          data[fieldKey].items[updatedIndex] = updatedRecord
          awsAppSyncClient.writeQuery({
            query: ListEliasInfo,
            data,
            variables: { tenantId },
          })
        },
        error: data => {
          const { errors } = data
          if (errors && errors.find(error => error.message === 'Network Error')) {
            this.subscriptions[facilityId].onUpdate.unsubscribe()
            delete this.subscriptions[facilityId].onUpdate
            if (retrying === 0) {
              retrying = 50
            }
            this.updateSubscription(facilityId, retrying * 2)
          }
        },
      })
    }, retrying)
  }

  deleteSubscription = (facilityId, retrying = 0) => {
    const {
      client: awsAppSyncClient,
      user: { tenantId },
    } = this.props
    if (!this.subscriptions[facilityId] || this.subscriptions[facilityId].onDelete) {
      return
    }

    setTimeout(() => {
      this.subscriptions[facilityId].onDelete = API.graphql(
        graphqlOperation(onDeleteSubscription, {
          facilityId,
        }),
      ).subscribe({
        next: ({
          value: {
            data: { onDeleteFloor, onDeleteSpace, onDeleteAsset },
          },
        }) => {
          retrying = 0
          let fieldKey
          let deletedRecord
          if (onDeleteFloor) {
            fieldKey = 'listFloors'
            deletedRecord = onDeleteFloor
          }
          if (onDeleteSpace) {
            fieldKey = 'listSpaces'
            deletedRecord = onDeleteSpace
          }
          if (onDeleteAsset) {
            fieldKey = 'listAssets'
            deletedRecord = onDeleteAsset
          }

          if (!fieldKey) {
            return
          }

          const listEliasRequest = {
            query: ListEliasInfo,
            variables: { tenantId },
          }
          const data = _.cloneDeep(awsAppSyncClient.readQuery(listEliasRequest))
          data[fieldKey].items = data[fieldKey].items.filter(item => item.id !== deletedRecord.id)

          awsAppSyncClient.writeQuery({
            query: ListEliasInfo,
            data,
            variables: { tenantId },
          })
        },
        error: data => {
          const { errors } = data
          if (errors && errors.find(error => error.message === 'Network Error')) {
            this.subscriptions[facilityId].onDelete.unsubscribe()
            delete this.subscriptions[facilityId].onDelete
            if (retrying === 0) {
              retrying = 50
            }
            this.deleteSubscription(facilityId, retrying * 2)
          }
        },
      })
    }, retrying)
  }

  appsyncStoreChanged = () => {
    const {
      dispatch,
      client: awsAppSyncClient,
      user: { status, tenantId },
    } = this.props
    const appsyncStore = awsAppSyncClient.cache.store.getState()
    const {
      offline: { online },
    } = appsyncStore
    if (status.online !== online) {
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          status: {
            online,
            lastUpdated: moment().toISOString(),
            indicator: 'green',
          },
        },
      })
    }

    // registering subscriptions
    if (!awsAppSyncClient.cache.data.data.ROOT_QUERY) {
      return
    }
    const request = {
      query: ListFacilities,
      variables: { tenantId },
    }

    try {
      const { listFacilities } = awsAppSyncClient.readQuery(request)

      const facilities = listFacilities.items || []
      facilities.forEach(facility => {
        if (!this.subscriptions[facility.id]) {
          this.subscriptions[facility.id] = {}
          this.createSubscription(facility.id, 0)
          this.updateSubscription(facility.id, 0)
          this.deleteSubscription(facility.id, 0)
        }
      })
      // For now, catch happended when store has nothing(e.x in the first load of website)
      // We do not need to do anything at that point cause it will be called again when listEliasInfo
      // Query is updated by network request
    } catch (error) {} // eslint-disable-line
  }

  removeAllSubscriptions = () => {
    _.keys(this.subscriptions).forEach(key => {
      const value = this.subscriptions[key]
      if (value.onCreate) {
        value.onCreate.unsubscribe()
      }

      if (value.onUpdate) {
        value.onUpdate.unsubscribe()
      }

      if (value.onDelete) {
        value.onDelete.unsubscribe()
      }
    })
  }

  updateOffset = () => {
    const {
      dispatch,
      user: { status },
    } = this.props

    if (status.online) {
      return
    }
    const { lastUpdated, online } = status
    const offsetFromLastUpdated = Math.ceil(
      moment.duration(moment().diff(moment(lastUpdated))).as('minutes'),
    )

    let indicator
    if (online || offsetFromLastUpdated < 180) {
      indicator = 'green'
    } else if (offsetFromLastUpdated < 360) {
      indicator = 'amber'
    } else {
      indicator = 'red'
    }
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        status: {
          ...status,
          indicator,
        },
      },
    })
  }

  appSyncQueryHandler = ({ data }) => {
    if (data.listFacilities) {
      const {
        location: { pathname },
        dispatch,
        user: { currentTenantId },
      } = this.props

      // check project id and facility id
      const pathPart = pathname.split('/')
      const isDataCollection = pathPart[1] === 'data-collection'
      if (isDataCollection) {
        const projectEncoded = pathPart[2]
        const facilityEncoded = pathPart[4]

        if (projectEncoded && facilityEncoded) {
          const facility = (data.listFacilities.items || []).find(
            item => makeURL(getConcatenatedUrl(item.code, item.name)) === facilityEncoded,
          )
          if (facility) {
            const tenant = tenants[facility.tenantId || '']
            if (tenant && currentTenantId !== facility.tenantId) {
              dispatch({
                type: 'user/SET_STATE',
                payload: {
                  currentTenantId: facility.tenantId,
                  currentTenant: tenant,
                },
              })
            }
          }
        }
      }
    }
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
      isMenuCollapsed,
      history,
    } = this.props

    const isTestPage = history.location.pathname === '/clickable-prototype/test-page'
    return (
      <Layout
        className={classNames({
          settings__borderLess: isBorderless,
          settings__squaredBorders: isSquaredBorders,
          settings__fixedWidth: isFixedWidth,
          settings__menuShadow: isMenuShadow,
          settings__menuTop: isMenuTop,
        })}
      >
        <BackTop />
        <Row className={styles.gridContainer}>
          <Col
            xl={isMenuCollapsed ? 2 : 6}
            lg={isMenuCollapsed ? 2 : 7}
            className={classNames(styles.container, {
              [styles.menuLeftContainer]: isMenuCollapsed,
            })}
          >
            <Menu />
          </Col>
          <Col
            xl={isMenuCollapsed ? 22 : 18}
            lg={isMenuCollapsed ? 22 : 17}
            md={24}
            className={isMenuCollapsed ? styles.contentContainer : ''}
          >
            <Layout>
              <Layout.Header>
                <TopBar isTest={isTestPage} breadcrumbs={['Home']} />
              </Layout.Header>
              <Layout.Content style={{ height: '100%', position: 'relative' }}>
                <ErrorBoundary pathname={history.location.pathname}>
                  <div className={`utils__content ${styles.contentArea}`}>{children}</div>
                </ErrorBoundary>
              </Layout.Content>
            </Layout>
          </Col>
        </Row>
      </Layout>
    )
  }

  render() {
    const {
      user: { tenantId },
    } = this.props
    return (
      <Query query={ListEliasInfo} fetchPolicy="cache-only" variables={{ tenantId }}>
        {this.appSyncQueryHandler}
      </Query>
    )
  }
}

export default withApollo(EliasMwaLayout)
