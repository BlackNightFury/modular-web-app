/* eslint import/no-unresolved: 0 */
// Needed because the two imports below have node_modules in them for some reason
import { graphql as originGraphql } from 'node_modules/react-apollo'

export { compose, withApollo } from 'node_modules/react-apollo'

export const apolloClient = {
  watchQuery: () => ({
    variables: null,
    options: {},
    refetch: () => {},
    fetchMore: () => {},
    updateQuery: () => {},
    startPolling: () => {},
    stopPolling: () => {},
    subscribe: () => {},
    subscribeToMore: () => {},
    currentResult: () => ({}),
    queryManager: {
      queryStore: {
        get: () => {},
      },
    },
  }),
  mutate: () =>
    new Promise(resolve => {
      resolve(true)
    }),
  getQueryCode: () => {},
}

export function graphql(document, operationOptions) {
  const newOptions = operationOptions.options || {}
  newOptions.client = apolloClient

  return originGraphql(document, {
    ...operationOptions,
    options: newOptions,
  })
}
