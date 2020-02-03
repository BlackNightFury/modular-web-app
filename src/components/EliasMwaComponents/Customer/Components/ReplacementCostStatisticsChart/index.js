import React from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import { getReplacementCostStatistics } from '@/utils/elasticsearch'
import styles from './style.scss'

const mapStateToProps = ({ user }) => ({ user })

@connect(mapStateToProps)
class ReplacementCostStatisticsChart extends React.Component {
  state = {
    P1P2UrgentHighCToDX: 0,
    P1UrgentCToDX: 0,
    P2HighCToDX: 0,
    P3P4LowToVLowCToDx: 0,
  }

  componentDidMount() {
    const {
      user: { tenantId },
      filter,
    } = this.props

    getReplacementCostStatistics(tenantId, filter).then(data => this.setState(data))
  }

  render() {
    const { P1P2UrgentHighCToDX, P1UrgentCToDX, P2HighCToDX, P3P4LowToVLowCToDx } = this.state
    return (
      <div>
        <Row gutter={16} type="flex">
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <div
              className={`${styles.chart} ${styles.noLink}`}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>P1 & P2 Urgent - High | C to DX</div>
              <div className={styles.chartValue}>£{P1P2UrgentHighCToDX.toLocaleString()}</div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <div
              className={`${styles.chart} ${styles.noLink}`}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>P1 Urgent | C to DX</div>
              <div className={styles.chartValue}>£{P1UrgentCToDX.toLocaleString()}</div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <div
              className={`${styles.chart} ${styles.noLink}`}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>P2 High | C to DX</div>
              <div className={styles.chartValue}>£{P2HighCToDX.toLocaleString()}</div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <div
              className={`${styles.chart} ${styles.noLink}`}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>P3 & P4 Low to V low | C to DX</div>
              <div className={styles.chartValue}>£{P3P4LowToVLowCToDx.toLocaleString()}</div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ReplacementCostStatisticsChart
