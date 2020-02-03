import React from 'react'
import { Row, Col } from 'antd'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import classNames from 'classnames'
import _ from 'lodash'
import { Helmet } from 'react-helmet'
import ReactHighChart from 'react-highcharts'

import styles from './style.scss'
// import { getAllAssets } from '@/utils/elasticsearch'
import { generateBarChartConfig, generatePieChartConfig } from '@/utils/charts'

export class Antd extends React.Component {
  constructor() {
    super()
    this.state = {
      numberOfAssets: 0,
      barChartData: {},
      pieChartData: {},
    }
  }

  componentDidMount() {
    // This is just for CBRE Demo, need to restore after demo
    const { history } = this.props
    history.push('/analytics/asset-management')

    // const {
    //   user: { tenantId },
    // } = this.props
    // getAllAssets(tenantId)
    //   .then(this.updateChartData)
    //   .catch(() => {
    //     // For now, no need to process error
    //   })
  }

  updateChartData = assets => {
    // get bar chart info
    const barChartData = _.reduce(
      assets,
      (result, asset) => {
        if (!asset.createdUser || !asset.createdUser.id) {
          return result
        }
        if (!result[asset.createdUser.id]) {
          result[asset.createdUser.id] = 0
        }

        result[asset.createdUser.id] += 1
        return result
      },
      {},
    )

    // get pie chart info
    const pieChartData = _.reduce(
      assets,
      (result, asset) => {
        if (!asset.facets || !asset.facets.condition) {
          return result
        }

        if (!result[asset.facets.condition]) {
          result[asset.facets.condition] = 0
        }

        result[asset.facets.condition] += 1
        return result
      },
      {},
    )

    this.setState({
      numberOfAssets: assets.length,
      barChartData,
      pieChartData,
    })
  }

  render() {
    const { numberOfAssets, barChartData, pieChartData } = this.state
    return (
      <div>
        <Helmet title="Home" />
        <ReactHighChart config={generateBarChartConfig(barChartData)} />
        <Row className={styles.bottomContainer}>
          <Col sm={24} md={12}>
            <ReactHighChart
              domProps={{ className: styles.pieChartContainer }}
              config={generatePieChartConfig(pieChartData)}
            />
          </Col>
          <Col sm={24} md={12}>
            <div className={classNames('analyticsCard', styles.numberOfAssetsContainer)}>
              <p>Metric: Asset Count</p>
              <div className={styles.detailsContainer}>
                <h1>{numberOfAssets}</h1>
                <p>Number of assets</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user })
export default withRouter(connect(mapStateToProps)(Antd))
