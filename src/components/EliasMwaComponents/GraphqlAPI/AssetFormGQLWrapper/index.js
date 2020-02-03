import React from 'react'
import moment from 'moment'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import shortid from 'shortid'
import { GetManufacturers } from '@/graphql/queries'
import { CreateManufacturer } from '@/graphql/mutations'

const Wrapper = WrappedComponent =>
  class AssetFormGQLWrapper extends React.Component {
    shouldComponentUpdate(nextProps) {
      const { facet, item } = this.props
      if (facet !== nextProps.facet || item !== nextProps.item) {
        return true
      }

      return false
    }

    render() {
      const {
        user: { currentTenantId: tenantId, tenantId: tenantOriginId, authenticatedBy },
      } = this.props

      const InputComponent = compose(
        graphql(CreateManufacturer, {
          options: {
            update: (dataProxy, { data: { createManufacturer } }) => {
              const { name } = createManufacturer

              const query = GetManufacturers

              const request = {
                query,
                variables: { tenantId: tenantOriginId },
              }
              const data = dataProxy.readQuery(request)
              const { manufacturers, alias } = JSON.parse(data.getManufacturers)

              if (manufacturers.find(manufacturer => manufacturer === name)) {
                return
              }
              manufacturers.push(name)

              dataProxy.writeQuery({
                query,
                data: { getManufacturers: JSON.stringify({ manufacturers, alias }) },
                variables: { tenantId: tenantOriginId },
              })
            },
          },
          props: props => ({
            onManufacturerAdd: manufacturer => {
              const formatedPost = {
                tenantId,
                id: shortid.generate(),
                name: manufacturer,
                createdAtClient: `${moment().toISOString()}`,
                createdBy: 'modular-web-application-js-datacollection-module',
              }

              props.mutate({
                variables: { input: formatedPost },
                optimisticResponse: () => ({
                  createManufacturer: {
                    ...formatedPost,
                    createdAt: `${moment().toISOString()}`,
                    currentVersion: 'v0001',
                    __typename: 'Manufacturer',
                  },
                }),
              })
            },
          }),
        }),
        graphql(GetManufacturers, {
          options: {
            fetchPolicy: 'cache-only',
            variables: { tenantId: tenantOriginId },
          },
          props: ({ data }) => {
            const { manufacturers, alias } = data.getManufacturers
              ? JSON.parse(data.getManufacturers)
              : { manufacturers: [], alias: {} }

            /* This is for demo version */
            if (authenticatedBy === 'demo') {
              return { manufacturers: ['LEC', 'LG', 'SE', 'SP'] }
            }

            return {
              manufacturers,
              alias,
            }
          },
        }),
      )(WrappedComponent)
      // The fact that we're returning the original input is a hint that it has
      // been mutated.
      return <InputComponent {...this.props} />
    }
  }

const mapStateToProps = ({ user }) => ({ user })
export default WrappedComponent => connect(mapStateToProps)(Wrapper(WrappedComponent))
