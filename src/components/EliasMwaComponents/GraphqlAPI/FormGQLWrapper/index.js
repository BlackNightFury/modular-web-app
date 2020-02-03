import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import moment from 'moment'
import shortid from 'shortid'
import { ListEliasInfo, ListFormResponses } from '@/graphql/queries'
import { CreateFormResponse } from '@/graphql/mutations'
import { getProjectDetails } from '../ProjectGQLWrapper'

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  if (isDemo) {
    const {
      prototype: { listEliasInfo: data },
      tenantId,
    } = ownProps
    const onAdd = post => ({
      tenantId,
      id: shortid.generate(),
      createdAt: `${moment().toISOString()}`,
      createdBy: 'modular-web-application-js-datacollection-module',
      ...post,
    })
    return (
      <WrappedComponent
        {...ownProps}
        onAdd={onAdd}
        facilities={getProjectDetails(
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listAssets ? data.listAssets.items : [],
        )}
      />
    )
  }
  const {
    user: { currentTenantId: tenantId, tenantId: tenantOriginId },
  } = ownProps
  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId: tenantOriginId },
      },
      props: ({ data }) => ({
        facilities: getProjectDetails(
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listAssets ? data.listAssets.items : [],
        ),
      }),
    }),
    graphql(CreateFormResponse, {
      options: {
        update: (dataProxy, { data: { createFormResponse } }) => {
          const query = ListFormResponses

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)
          if (data.listFormResponses.items.find(post => post.id === createFormResponse.id)) {
            return
          }
          data.listFormResponses.items.splice(0, 0, createFormResponse)
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onAdd: post => {
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

          return formatedPost
        },
      }),
    }),
  )(WrappedComponent)

  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype, settings }) => ({
  user,
  prototype,
  screenSize: settings.screenSize,
})
export default (WrappedComponent, isDemo) =>
  connect(mapStateToProps)(Wrapper(WrappedComponent, isDemo))
