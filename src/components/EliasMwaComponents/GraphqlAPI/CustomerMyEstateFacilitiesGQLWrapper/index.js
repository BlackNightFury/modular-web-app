import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import { ListEliasInfo } from '@/graphql/queries'
import { makeDetailedAssets } from '@/services/asset'

const getDetailedFacilities = (projects, facilities, sites, assets) => {
  const facilitiesInfo = facilities.map(facility => {
    const subAssets = makeDetailedAssets(
      assets.filter(asset => asset.facilityId === facility.id && asset.spaceId),
    )
    const subVAssets = makeDetailedAssets(
      assets.filter(asset => asset.facilityId === facility.id && !asset.spaceId),
    )
    const siteInfo = sites.find(site => site.id === facility.siteId)
    let projectInfo = null
    projects.some(
      project =>
        project.sites &&
        project.sites.some(site => {
          if (site === facility.siteId) {
            projectInfo = project
          }
          return site === facility.siteId
        }),
    )
    return {
      ...facility,
      facets: JSON.parse(facility.facets),
      notes: JSON.parse(facility.notes),
      assets: subAssets.length,
      virtualAssets: subVAssets.length,
      site: siteInfo && siteInfo.name,
      project: projectInfo || {},
    }
  })

  return {
    facilities: facilitiesInfo,
  }
}

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  if (isDemo) {
    const {
      prototype: { listEliasInfo: data },
    } = ownProps
    return (
      <WrappedComponent
        {...ownProps}
        {...getDetailedFacilities(
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listSites ? data.listSites.items : [],
          data.listAssets ? data.listAssets.items : [],
        )}
        projects={data.listProjects ? data.listProjects.items : []}
      />
    )
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
        ...getDetailedFacilities(
          data.listProjects ? data.listProjects.items : [],
          data.listFacilities ? data.listFacilities.items : [],
          data.listSites ? data.listSites.items : [],
          data.listAssets ? data.listAssets.items : [],
        ),
        projects: data.listProjects ? data.listProjects.items : [],
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
