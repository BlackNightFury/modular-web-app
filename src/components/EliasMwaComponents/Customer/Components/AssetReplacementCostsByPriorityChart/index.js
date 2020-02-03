import React from 'react'
import { connect } from 'dva'
import ReactHighChart from 'react-highcharts'
import { getAssetCostsByPriority } from '@/utils/elasticsearch'
import { generateAssetReplacementCostsByPriorityChartConfig } from '@/utils/charts'
import styles from './style.scss'

const mapStateToProps = ({ user }) => ({ user })

@connect(mapStateToProps)
class AssetReplacementCostsByPriorityChart extends React.Component {
  state = {
    assetCostsByPriority: [],
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

    getAssetCostsByPriority(tenantId, filter).then(data =>
      this.setState({ assetCostsByPriority: data }),
    )
  }

  render() {
    const { assetCostsByPriority } = this.state
    return (
      <div className={styles.chartContainer}>
        <ReactHighChart
          config={generateAssetReplacementCostsByPriorityChartConfig(assetCostsByPriority)}
          domProps={{
            'data-test-selector': 'asset_replacement_costs_by_priority_chart',
          }}
        />
      </div>
    )
  }
}

export default AssetReplacementCostsByPriorityChart
