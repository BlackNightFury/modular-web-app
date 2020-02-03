import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import shortid from 'shortid'
import { GetAssetsHierarchy, ListEliasInfo } from '@/graphql/queries'
import { makeHierarchyTree } from '@/services/utils'
import { makeDetailedAssets } from '@/services/asset'
import { GenerateReport } from '@/graphql/mutations'

const { tenants } = window.mwa_config

const Wrapper = (WrappedComponent, isDemo) => ownProps => {
  if (isDemo) {
    const {
      prototype: { listEliasInfo: data, hierarchy },
    } = ownProps
    return (
      <WrappedComponent
        {...ownProps}
        assets={makeDetailedAssets(data.listAssets.items || [])}
        treeData={makeHierarchyTree(hierarchy, false, true)}
        isVAInSpace
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
        sites: data.listSites ? data.listSites.items : [],
        projects: data.listProjects ? data.listProjects.items : [],
        facilities: data.listFacilities ? data.listFacilities.items : [],
        floors: data.listFloors ? data.listFloors.items : [],
        spaces: data.listSpaces ? data.listSpaces.items : [],
        assets: makeDetailedAssets(data.listAssets ? data.listAssets.items : []).map(obj => {
          const facility = (data.listFacilities ? data.listFacilities.items : []).find(
            item => item.id === obj.facilityId,
          )
          const system = obj.assetType && obj.assetType.tree[0]
          return {
            ...obj,
            facility: facility && facility.name,
            system,
          }
        }),
        isVAInSpace: true,
      }),
    }),
    graphql(GetAssetsHierarchy, {
      options: {
        fetchPolicy: 'cache-only',
        variables: {
          projects: [{ tenantId, projectId: tenants[tenantId].legacy_project_id }],
        },
      },
      props: ({ data }) => {
        let hierarchy = data.getHierarchy ? JSON.parse(data.getHierarchy) : {}
        hierarchy = hierarchy[`${tenants[tenantId].legacy_project_id}`] || {}
        return {
          treeData: makeHierarchyTree(hierarchy.hierarchy || [], false, true),
        }
      },
    }),
    graphql(GenerateReport, {
      options: {
        update: (dataProxy, { data: { generateReport } }) => {
          dispatch({
            type: 'report/REPORT_GENERATION_FINISH',
            payload: generateReport,
          })
        },
      },
      props: props => ({
        onGenerateReport: filters => {
          const id = shortid.generate()
          props.mutate({
            variables: {
              filters,
              reportDetails: {
                id,
                type: 'ASSET_MANAGEMENT_CAFM_EXPORT',
                name: 'Asset management CAFM Export',
                format: 'CSV',
              },
            },
          })
          dispatch({
            type: 'report/REPORT_GENERATION_START',
            payload: { id, type: 'EXPORT_CAFM' },
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
