import React from 'react'
import { Helmet } from 'react-helmet'
import AssetReplacementCostsByPriorityChart from '../AssetReplacementCostsByPriorityChart'
// import LifecycleSimpleCharts from '../LifecycleSimpleCharts'
import AssetReplacementCostsGroupedByFacilityChart from '../AssetReplacementCostsGroupedByFacilityChart'
import ReplacementCostStatisticsChart from '../ReplacementCostStatisticsChart'

class AssetManagementDashboard extends React.Component {
  render() {
    const { filter } = this.props

    return (
      <div data-test-selector="lifecycle_and_replacementcosts_dashboardview">
        <Helmet title="Dashboard - Lifecycle And Replacement Costs | 10 years" />
        <AssetReplacementCostsGroupedByFacilityChart filter={filter} />
        {/* <LifecycleSimpleCharts filter={filter} /> */}
        <AssetReplacementCostsByPriorityChart filter={filter} />
        <ReplacementCostStatisticsChart filter={filter} />
      </div>
    )
  }
}

export default AssetManagementDashboard
