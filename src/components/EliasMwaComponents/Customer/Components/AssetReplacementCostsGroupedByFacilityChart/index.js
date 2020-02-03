import React from 'react'
import { connect } from 'dva'
import ReactHighChart from 'react-highcharts'
import { getAssetsGroupedByFacility } from '@/utils/elasticsearch'
import { generateAssetReplacementCostsGroupedByFacilityChartConfig } from '@/utils/charts'
import styles from './style.scss'

const mapStateToProps = ({ user }) => ({ user })

@connect(mapStateToProps)
class AssetReplacementCostsGroupedByFacilityChart extends React.Component {
  state = {
    assetsGroupedByFacility: [],
  }

  componentDidMount() {
    this.getAssetsData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getAssetsData(nextProps)
  }

  getAssetsData = props => {
    const {
      user: { tenantId },
      filter,
    } = props

    getAssetsGroupedByFacility(tenantId, filter).then(data =>
      this.setState({ assetsGroupedByFacility: data }),
    )
  }

  render() {
    const { assetsGroupedByFacility } = this.state
    return (
      <div className={styles.chartContainer}>
        <ReactHighChart
          config={generateAssetReplacementCostsGroupedByFacilityChartConfig(
            assetsGroupedByFacility,
          )}
          domProps={{
            'data-test-selector': 'asset_replacement_costs_chart',
          }}
        />
      </div>
    )
  }
}

export default AssetReplacementCostsGroupedByFacilityChart
