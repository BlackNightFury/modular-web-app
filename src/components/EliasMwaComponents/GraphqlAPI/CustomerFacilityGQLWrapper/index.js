import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import _ from 'lodash'
import { makeURL, getProjectFromEncoded, getConcatenatedUrl } from '@/services/utils'
import { ListEliasInfo } from '@/graphql/queries'

const getFacilityDetails = (
  tenantId,
  projectNameEncoded,
  facilityNameEncoded,
  projects,
  sites,
  facilities,
  floors,
  spaces,
  assets,
) => {
  const project = getProjectFromEncoded(projects, projectNameEncoded)
  const filteredFacilities = facilities.filter(
    facility => makeURL(getConcatenatedUrl(facility.code, facility.name)) === facilityNameEncoded,
  )
  const facilityId = filteredFacilities.length > 0 ? filteredFacilities[0].id : undefined

  const filteredFloors = floors.filter(floor => floor.facilityId === facilityId)
  const filteredSpaces = spaces.filter(space => space.facilityId === facilityId)
  const filteredAssets = assets.filter(asset => asset.facilityId === facilityId)

  const facility = filteredFacilities[0] || {}
  const curFacets = JSON.parse(facility.facets || '{}')

  const { numberOfFacilitiesOnSite, numberOfSimilarFacilities } = _.reduce(
    facilities,
    (result, item) => {
      if (item.siteId === facility.siteId) {
        result.numberOfFacilitiesOnSite += 1
      }
      const facets = JSON.parse(item.facets, '{}')

      if (curFacets['facility-type'] === facets['facility-type']) {
        result.numberOfSimilarFacilities += 1
      }
      return result
    },
    {
      numberOfFacilitiesOnSite: 0,
      numberOfSimilarFacilities: 0,
    },
  )

  const site = sites.find(item => item.id === facility.siteId) || {}

  return {
    project,
    site,
    facility: {
      ...facility,
      facets: JSON.parse(facility.facets || '{}'),
      notes: JSON.parse(facility.notes || '{}'),
    },
    numberOfAssets: filteredAssets.length,
    numberOfSpaces: filteredSpaces.length,
    numberOfFloors: filteredFloors.length,
    numberOfFacilitiesOnSite,
    numberOfSimilarFacilities,
  }
}

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  const {
    match: {
      params: { projectName: projectNameEncoded, facilityName: facilityNameEncoded },
    },
  } = ownProps

  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, tenantId },
    } = ownProps

    const facilityDetails = getFacilityDetails(
      tenantId,
      projectNameEncoded,
      facilityNameEncoded,
      data.listProjects ? data.listProjects.items : [],
      data.listSites ? data.listSites.items : [],
      data.listFacilities ? data.listFacilities.items : [],
      data.listFloors ? data.listFloors.items : [],
      data.listSpaces ? data.listSpaces.items : [],
      data.listAssets ? data.listAssets.items : [],
    )

    return <WrappedComponent {...ownProps} {...facilityDetails} />
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
      props: ({ data }) => ({
        ...getFacilityDetails(
          tenantId,
          projectNameEncoded,
          facilityNameEncoded,
          data.listProjects ? data.listProjects.items : [],
          data.listSites ? data.listSites.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listFloors ? data.listFloors.items : [],
          data.listSpaces ? data.listSpaces.items : [],
          data.listAssets ? data.listAssets.items : [],
        ),
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
