import React from 'react'
import { connect } from 'dva'
import Highcharts from 'highcharts/highcharts'
import HighchartsMore from 'highcharts/highcharts-more'

import { getAssetsBySystemAndType } from '@/utils/elasticsearch'
import { generateAssetsBySystemAndTypeChartConfig } from '@/utils/charts'

const ReactHighChart = require('react-highcharts').withHighcharts(Highcharts)

HighchartsMore(ReactHighChart.Highcharts)

const mapStateToProps = ({ user }) => ({ user })

@connect(mapStateToProps)
class AssetsBySystemAndTypeChart extends React.Component {
  constructor() {
    super()
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    const {
      user: { tenantId },
      filter,
    } = this.props
    getAssetsBySystemAndType(tenantId, filter)
      .then(data => this.setState({ data }))
      .catch(() => {})
  }

  componentWillReceiveProps(nextProps) {
    const { filter } = this.props

    if (nextProps.filter !== filter) {
      const {
        user: { tenantId },
      } = nextProps

      getAssetsBySystemAndType(tenantId, nextProps.filter)
        .then(data => this.setState({ data }))
        .catch(() => {})
    }
  }

  onAsset = ({ point }) => {
    const { goToAssetManagementListing } = this.props
    goToAssetManagementListing({
      filter: {
        filterKeys: [`${point.assetType.description}-${point.assetType.legacyId}`],
        normalizedFilter: {
          assetType: {
            class: 'ALL',
            trees: [point.assetType.tree],
          },
        },
      },
    })
  }

  render() {
    const { data } = this.state

    return (
      <ReactHighChart
        config={generateAssetsBySystemAndTypeChartConfig(data, this.onAsset)}
        domProps={{
          'data-test-selector': 'assets_by_system_and_type_chart',
        }}
      />
    )
  }
}

export default AssetsBySystemAndTypeChart
