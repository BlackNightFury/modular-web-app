import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import shortid from 'shortid'
import moment from 'moment'
import { ListEliasInfo } from '@/graphql/queries'
import { CreateFormResponse, UpdateFormResponse } from '@/graphql/mutations'
import {
  makeURL,
  getProjectFromEncoded,
  getConcatenatedUrl,
  checkIfReadOnlyFromParent,
} from '@/services/utils'
import { padWithZeros, makeDetailedAssets } from '@/services/asset'
import { checkIfFacilityCompleted } from '@/services/completion'

const getDetails = (
  projectNameEncoded,
  facilityNameEncoded,
  projects,
  facilities,
  formResponses,
  sites,
  floors,
  spaces,
  assets,
  facilityPSQCompleted,
) => {
  const project = getProjectFromEncoded(projects, projectNameEncoded)

  const filteredFacilities = facilities.filter(
    facility => makeURL(getConcatenatedUrl(facility.code, facility.name)) === facilityNameEncoded,
  )

  const facilityCompletionResponses = formResponses.filter(formResponse => {
    const { type, status } = JSON.parse(formResponse.response)
    return type === 'facility-completion' && status === 'Complete'
  })
  const facility = filteredFacilities.length > 0 ? filteredFacilities[0] : {}

  let savedFacilityCompletion = formResponses.find(formResponse => {
    const { facilityId, status } = JSON.parse(formResponse.response)
    return facilityId === facility.id && status === 'inProgress'
  })
  if (savedFacilityCompletion) {
    savedFacilityCompletion = {
      ...savedFacilityCompletion,
      response: JSON.parse(savedFacilityCompletion.response),
    }
  }

  let savedSiteCompletion = formResponses.find(formResponse => {
    const { type, status, siteId } = JSON.parse(formResponse.response)
    return siteId === facility.siteId && type === 'facility-completion' && status === 'Complete'
  })

  if (savedSiteCompletion) {
    savedSiteCompletion = {
      ...savedFacilityCompletion,
      response: JSON.parse(savedFacilityCompletion.response),
    }
  }

  const site = sites.find(item => item.id === facility.siteId)

  let isLastFacility = false
  if (site) {
    const facilitiesInSite = facilities.map(item => item.siteId === site.id)
    isLastFacility =
      facilityCompletionResponses.filter(item => {
        const { type, status, facilityId } = JSON.parse(item.response)
        return (
          type === 'facility-completion' &&
          status === 'Complete' &&
          facilitiesInSite.find(facilityItem => facilityItem.id === facilityId)
        )
      }).length ===
      facilitiesInSite.length - 1
  }

  const { readOnly, readOnlyReason } = checkIfReadOnlyFromParent(
    project,
    facility,
    formResponses,
    facilities,
    facilityPSQCompleted,
  )

  const numberOfFloorsInFacility = floors.filter(item => item.facilityId === facility.id).length
  const numberOfSpacesInFacility = spaces.filter(item => item.facilityId === facility.id).length
  const numberOfAssetsInFacility = assets.filter(
    item => !item.assetType.virtual && item.facilityId === facility.id,
  ).length
  const numberOfVAInFacility = assets.filter(
    item => item.assetType.virtual && item.facilityId === facility.id,
  ).length

  return {
    project,
    facility,
    site,
    isLastFacility,
    savedFacilityCompletion,
    savedSiteCompletion,
    readOnly,
    readOnlyReason,
    numberOfFloorsInFacility,
    numberOfSpacesInFacility,
    numberOfAssetsInFacility,
    numberOfVAInFacility,
  }
}

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  const {
    user: { currentTenantId: tenantId, tenantId: tenantOriginId, facilityPSQCompleted },
    match: {
      params: { projectName: projectNameEncoded, facilityName: facilityNameEncoded },
    },
    dispatch,
  } = ownProps

  if (isDemo) {
    const {
      prototype: { listEliasInfo: data },
    } = ownProps

    const allRecords = {
      facilities: data.listFacilities ? data.listFacilities.items : [],
      floors: data.listFloors ? data.listFloors.items : [],
      spaces: data.listSpaces ? data.listSpaces.items : [],
      assets: makeDetailedAssets(data.listAssets ? data.listAssets.items : []),
    }

    const { project, facility, readOnly, readOnlyReason } = getDetails(
      projectNameEncoded,
      facilityNameEncoded,
      data.listProjects ? data.listProjects.items : [],
      data.listFacilities ? data.listFacilities.items : [],
      data.listFormResponses ? data.listFormResponses.items : [],
      data.listSites ? data.listSites.items : [],
      data.listFloors ? data.listFloors.items : [],
      data.listSpaces ? data.listSpaces.items : [],
      data.listAssets ? data.listAssets.items : [],
      facilityPSQCompleted,
    )

    return (
      <WrappedComponent
        {...ownProps}
        project={project}
        facility={facility}
        allRecords={allRecords}
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
      />
    )
  }
  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId: tenantOriginId },
      },
      props: ({ data }) => {
        const listFormResponses = data.listFormResponses ? data.listFormResponses.items : []
        const facilities = data.listFacilities ? data.listFacilities.items : []
        const isCompleted = checkIfFacilityCompleted(
          listFormResponses,
          facilities,
          facilityNameEncoded,
        )
        return {
          allRecords: {
            facilities: data.listFacilities ? data.listFacilities.items : [],
            floors: data.listFloors ? data.listFloors.items : [],
            spaces: data.listSpaces ? data.listSpaces.items : [],
            assets: makeDetailedAssets(data.listAssets ? data.listAssets.items : []),
          },
          ...getDetails(
            projectNameEncoded,
            facilityNameEncoded,
            data.listProjects ? data.listProjects.items : [],
            data.listFacilities ? data.listFacilities.items : [],
            data.listFormResponses ? data.listFormResponses.items : [],
            data.listSites ? data.listSites.items : [],
            data.listFloors ? data.listFloors.items : [],
            data.listSpaces ? data.listSpaces.items : [],
            data.listAssets ? data.listAssets.items : [],
            facilityPSQCompleted,
          ),
          isCompleted,
        }
      },
    }),
    graphql(CreateFormResponse, {
      options: {
        update: (dataProxy, { data: { createFormResponse } }) => {
          const query = ListEliasInfo
          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listFormResponses.items.findIndex(
            post => post.id === createFormResponse.id,
          )
          if (updatedIndex > -1) {
            return
          }
          data.listFormResponses.items.splice(0, 0, createFormResponse)
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
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
            ownProps: { facility },
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
        onAddCompletion: (post, name) => {
          const formatedPost = {
            tenantId,
            id: shortid.generate(),
            createdAtClient: `${moment().toISOString()}`,
            createdBy: 'modular-web-application-js-datacollection-module',
            ...post,
          }

          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => {
              const { response, formId } = formatedPost
              const { status, facilityId, siteId } = JSON.parse(response)

              if (status === 'Complete') {
                dispatch({
                  type: 'completion/DATA_COMPLETED',
                  payload: { id: formId === 'complete-facility' ? facilityId : siteId, name },
                })
              }
              return {
                createFormResponse: {
                  ...formatedPost,
                  createdAt: `${moment().toISOString()}`,
                  currentVersion: 'v0001',
                  __typename: 'FormResponse',
                },
              }
            },
          })

          return formatedPost
        },
      }),
    }),
    graphql(UpdateFormResponse, {
      options: {
        update: (dataProxy, { data: { updateFormResponse } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId: tenantOriginId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listFormResponses.items.findIndex(
            post => post.id === updateFormResponse.id,
          )
          data.listFormResponses.items[updatedIndex] = updateFormResponse
          dataProxy.writeQuery({ query, data, variables: { tenantId: tenantOriginId } })
        },
      },
      props: props => ({
        onUpdateCompletion: (post, name) => {
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
          const version = `v${padWithZeros(parseInt(currentVersion.slice(1), 10) + 1, 4)}`
          const formatedPost = {
            ...updatedPost,
            tenantId,
            createdAtClient: moment().toISOString(),
            createdBy: 'modular-web-application-js-datacollection-module',
            version,
          }
          props.mutate({
            variables: { input: formatedPost },
            optimisticResponse: () => {
              const { response, formId } = formatedPost
              const { status, facilityId, siteId } = JSON.parse(response)

              if (status === 'Complete') {
                dispatch({
                  type: 'completion/DATA_COMPLETED',
                  payload: { id: formId === 'complete-facility' ? facilityId : siteId, name },
                })
              }
              return {
                updateFormResponse: {
                  ...formatedPost,
                  createdAt: `${moment().toISOString()}`,
                  currentVersion: version,
                  __typename: 'FormResponse',
                },
              }
            },
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
