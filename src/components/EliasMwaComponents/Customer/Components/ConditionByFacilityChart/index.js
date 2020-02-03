import React from 'react'
import { connect } from 'dva'
import ReactHighChart from 'react-highcharts'
import { getConditionByFacilityAssetsAggregations } from '@/utils/elasticsearch'
import { generateConditionByFacilityChartConfig } from '@/utils/charts'

const mapStateToProps = ({ user }) => ({ user })

@connect(mapStateToProps)
class ConditionByFacilityChart extends React.Component {
  constructor() {
    super()
    this.state = {
      conditions: [],
      facilityNames: [],
      assetsByConditionAndFacility: [],
    }
  }

  componentDidMount() {
    const {
      user: { tenantId },
      filter,
    } = this.props
    getConditionByFacilityAssetsAggregations(tenantId, filter)
      .then(data => this.setState(data))
      .catch(() => {})
  }

  componentWillReceiveProps(nextProps) {
    const { filter } = this.props
    if (nextProps.filter !== filter) {
      const {
        user: { tenantId },
      } = nextProps

      getConditionByFacilityAssetsAggregations(tenantId, nextProps.filter)
        .then(data => this.setState(data))
        .catch(() => {})
    }
  }

  render() {
    const { assetsByConditionAndFacility, facilityNames, conditions } = this.state

    return (
      <ReactHighChart
        config={generateConditionByFacilityChartConfig(
          facilityNames,
          conditions,
          assetsByConditionAndFacility,
        )}
        domProps={{
          'data-test-selector': 'asset_management_dashboard_chart',
        }}
      />
    )
  }
}

export default ConditionByFacilityChart
