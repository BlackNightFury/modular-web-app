import React from 'react'
import localForage from 'localforage'
import { connect } from 'dva'
import { ApolloProvider, Query } from 'react-apollo'
import { Auth } from 'aws-amplify'
import AWSAppSyncClient, { AUTH_TYPE } from 'reams-aws-appsync'
import { Rehydrated } from 'reams-aws-appsync-react'
import { Helmet } from 'react-helmet'
import NewRelic from 'new-relic-agent-react'
import EnqueuedListAssetsQuery from '@/components/EliasMwaComponents/GraphqlAPI/EnqueuedListAssetsQuery'
import ErrorBoundary from '@/components/EliasMwaComponents/Host/ErrorBoundary'
import { GetManufacturers, GetSpaceTypes } from '@/graphql/queries'
import { getAllLegacyProjectIds } from '@/services/utils'

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'modular-web-app',
  version: 1.0,
  storeName: 'elias_asset_data',
  description: 'Elias Asset AppSync Offline Data',
})

const { aws, tenants } = window.mwa_config
const legacyProjectIds = getAllLegacyProjectIds(tenants)

const client = new AWSAppSyncClient({
  url: aws.appsync.graphqlEndpoint,
  region: aws.project_region,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: () => Auth.currentCredentials(),
  },
  offlineConfig: {
    storage: localForage,
  },
  complexObjectsCredentials: () => Auth.currentCredentials(),
})

window.appsyncClient = client

const mapStateToProps = ({ user }) => ({ authUser: user })

@connect(mapStateToProps)
class AppsyncWrapper extends React.Component {
  render() {
    const {
      children,
      authUser: { authenticated, tenantId, authenticatedBy, tenant, isGlobal },
    } = this.props

    const {
      mwa_config: {
        newRelicConfig: { applicationId, licenseKey, beacon, errorBeacon, localhostAppID },
      },
    } = window
    const applicationID = process.env.NODE_ENV === 'development' ? localhostAppID : applicationId
    //eslint-disable-next-line
    const newRelicScript = NewRelic({
      licenseKey,
      applicationID,
      beacon,
      errorBeacon,
    }).props.dangerouslySetInnerHTML.__html

    return (
      <>
        <Helmet>
          <script type="text/javascript">{newRelicScript}</script>
        </Helmet>
        <ErrorBoundary>
          <ApolloProvider client={client}>
            <Rehydrated>
              {authenticated && authenticatedBy !== 'demo' ? (
                <Query
                  query={GetManufacturers}
                  fetchPolicy="cache-and-network"
                  variables={{ tenantId }}
                >
                  {() => (
                    <Query
                      query={GetSpaceTypes}
                      fetchPolicy="cache-and-network"
                      variables={{
                        projects: isGlobal ? legacyProjectIds : [tenant.legacy_project_id],
                      }}
                    >
                      {() => <EnqueuedListAssetsQuery>{children}</EnqueuedListAssetsQuery>}
                    </Query>
                  )}
                </Query>
              ) : (
                children
              )}
            </Rehydrated>
          </ApolloProvider>
        </ErrorBoundary>
      </>
    )
  }
}

export default AppsyncWrapper
