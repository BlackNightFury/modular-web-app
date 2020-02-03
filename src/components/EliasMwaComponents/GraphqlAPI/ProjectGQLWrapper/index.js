import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import moment from 'moment'
import shortid from 'shortid'
import { ListEliasInfo } from '@/graphql/queries'
import { makeURL } from '@/services/utils'
import { checkIfFacilityCompleted } from '@/services/completion'
import { UpdateFacility, CreateFormResponse } from '@/graphql/mutations'
import { padWithZeros } from '@/services/asset'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import { getInstallDateFormat } from '@/services/asset-validation'

export const getProjectDetails = (projects, facilities, spaces, assets, formResponses) => {
  const facilitiesInfo = []
  if (projects) {
    facilities.forEach(item => {
      const project = projects.find(projectItem =>
        projectItem.sites.find(site => site === item.siteId),
      )
      if (!project) {
        return
      }

      const { facets } = item
      const newFacets = JSON.parse(facets)
      if (newFacets) {
        newFacets['build-date'] = getBrowserLocaledDateTimeString(newFacets['build-date'])
      }

      facilitiesInfo.push({
        ...item,
        originId: item.id,
        id: `${item.id}#${project.id}`,
        project: project.name,
        spaces: spaces.filter(space => space.facilityId === item.id).length,
        assets: assets.filter(asset => asset.facilityId === item.id).length,
        isCompleted: checkIfFacilityCompleted(formResponses, facilities, makeURL(item.name)),
        facets: newFacets,
        notes: JSON.parse(item.notes || '{}'),
      })
    })
  }

  return facilitiesInfo
}

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, tenantId },
    } = ownProps

    const onAddPreSurveyorResponse = (_, post) => {
      const formatedPost = {
        tenantId,
        id: shortid.generate(),
        createdAtClient: `${moment().toISOString()}`,
        createdBy: 'modular-web-application-js-datacollection-module',
        ...post,
      }

      return formatedPost
    }
    return (
      <WrappedComponent
        {...ownProps}
        facilities={getProjectDetails(
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listSpaces ? data.listSpaces.items : [],
          data.listAssets ? data.listAssets.items : [],
          data.listFormResponses ? data.listFormResponses.items : [],
        )}
        onAddPreSurveyorResponse={onAddPreSurveyorResponse}
        projects={data.listProjects ? data.listProjects.items : []}
      />
    )
  }
  const {
    user: { tenantId },
    dispatch,
  } = ownProps

  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId },
      },
      props: ({ data }) => ({
        facilities: getProjectDetails(
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listSpaces ? data.listSpaces.items : [],
          data.listAssets ? data.listAssets.items : [],
          data.listFormResponses ? data.listFormResponses.items : [],
        ),
        projects: data.listProjects ? data.listProjects.items : [],
      }),
    }),
    graphql(UpdateFacility, {
      options: {
        update: (dataProxy, { data: { updateFacility } }) => {
          const query = ListEliasInfo

          const request = {
            query,
            variables: { tenantId },
          }
          const data = dataProxy.readQuery(request)
          const updatedIndex = data.listFacilities.items.findIndex(
            item => item.id === updateFacility.id,
          )

          data.listFacilities.items[updatedIndex] = updateFacility
          dataProxy.writeQuery({ query, data, variables: { tenantId } })
        },
      },
      props: props => ({
        onUpdate: post => {
          const {
            assets,
            createdAt,
            createdBy,
            createdUser,
            currentVersion,
            isCompleted,
            __typename,
            docs,
            images,
            originId,
            facets,
            notes,
            project,
            ...updatedPost
          } = post

          facets['build-date'] = moment(facets['build-date'], getInstallDateFormat())
            .toDate()
            .toISOString()

          const version = `v${padWithZeros(parseInt(currentVersion.slice(1), 10) + 1, 4)}`
          const formatedPost = {
            ...updatedPost,
            id: originId,
            docs: docs ? docs.map(doc => ({ id: doc.id, text: doc.text })) : [],
            images: (images || []).map(image => ({
              dataUri: image.dataUri.startsWith('blob') ? null : image.dataUri,
              picture: {
                bucket: image.picture.bucket,
                key: image.picture.key,
              },
            })),
            facets: JSON.stringify(facets),
            notes: JSON.stringify(notes || {}),
            createdAtClient: moment().toISOString(),
            createdBy: 'modular-web-application-js-datacollection-module',
            version,
          }

          props.mutate({
            variables: {
              input: formatedPost,
            },
            optimisticResponse: () => ({
              updateFacility: {
                ...formatedPost,
                createdAt: `${moment().toISOString()}`,
                currentVersion: version,
                docs: formatedPost.docs.map(doc => ({ ...doc, __typename: 'Doc' })),
                images: (formatedPost.images || []).map(image => ({
                  ...image,
                  picture: {
                    ...image.picture,
                    __typename: 'S3Object',
                  },
                  __typename: 'AssetImage',
                })),
                __typename: 'Facility',
              },
            }),
          })
        },
      }),
    }),
    graphql(CreateFormResponse, {
      props: props => ({
        onAddPreSurveyorResponse: (post, facilityId) => {
          const formatedPost = {
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
            ownProps: {
              user: { facilityPSQCompleted },
            },
          } = props
          dispatch({
            type: 'user/SET_STATE',
            payload: {
              facilityPSQCompleted: [
                ...facilityPSQCompleted,
                { facilityId, formId: formatedPost.id },
              ],
            },
          })

          return formatedPost
        },
      }),
    }),
  )(WrappedComponent)

  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype }) => ({
  user,
  prototype,
})
export default (WrappedComponent, isDemo) =>
  connect(mapStateToProps)(Wrapper(WrappedComponent, isDemo))
