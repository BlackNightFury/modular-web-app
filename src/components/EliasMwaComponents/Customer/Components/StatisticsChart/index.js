import React from 'react'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import { Row, Col, Icon } from 'antd'
import { getMyEstateStatus } from '@/utils/elasticsearch'
import styles from './style.scss'

const mapStateToProps = ({ user }) => ({ user })

@connect(mapStateToProps)
class StatisticsChart extends React.Component {
  state = {
    totalFacilities: 0,
    totalSpaces: 0,
    totalAssets: 0,
    maintainedAssets: 0,
    operationalAssets: 0,
    totalAssetTypes: 0,
  }

  componentDidMount() {
    const {
      user: { tenantId },
    } = this.props

    getMyEstateStatus(tenantId).then(data => this.setState(data))
  }

  goToMyFacilities = () => {
    const { history } = this.props
    history.push('/my-estate/facilities')
  }

  goToMySpaces = () => {
    const { history } = this.props
    history.push('/my-estate/spaces')
  }

  goToAssets = () => {
    const { goToAssetManagementListing } = this.props
    goToAssetManagementListing({
      sortBy: 'type',
    })
  }

  goToAssetTypes = () => {
    const { goToAssetManagementListing } = this.props
    goToAssetManagementListing({
      sortBy: 'system',
    })
  }

  goToOperationalAssets = () => {
    //need to complete after filter feature is updated on asset management listing
    const { goToAssetManagementListing } = this.props
    goToAssetManagementListing({
      // filterBy: '',
    })
  }

  goToMaintainedAssets = () => {
    //need to complete after filter feature is updated on asset management listing
    const { goToAssetManagementListing } = this.props
    goToAssetManagementListing({
      // filterBy: '',
    })
  }

  render() {
    const {
      totalFacilities,
      totalSpaces,
      totalAssets,
      maintainedAssets,
      operationalAssets,
      totalAssetTypes,
    } = this.state
    return (
      <div>
        <Row gutter={16} type="flex">
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div
              className={styles.chart}
              onClick={this.goToMyFacilities}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>Number Of Facilities</div>
              <div className={styles.chartValue}>
                <Icon type="bank" className={styles.marginRight10} />
                {totalFacilities}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div
              className={styles.chart}
              onClick={this.goToMySpaces}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>Number Of Spaces</div>
              <div className={styles.chartValue}>
                <Icon type="border" className={styles.marginRight10} />
                {totalSpaces}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div
              className={styles.chart}
              onClick={this.goToMaintainedAssets}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>Number of Maintained Assets</div>
              <div className={styles.chartValue}>
                <Icon type="tool" className={styles.marginRight10} />
                {maintainedAssets}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div
              className={styles.chart}
              onClick={this.goToOperationalAssets}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>Number Of Operational Assets</div>
              <div className={styles.chartValue}>
                <Icon type="like" className={styles.marginRight10} />
                {operationalAssets}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div
              className={styles.chart}
              onClick={this.goToAssets}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>Number of Assets</div>
              <div className={styles.chartValue}>
                <Icon type="barcode" className={styles.marginRight10} />
                {totalAssets}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div
              className={styles.chart}
              onClick={this.goToAssetTypes}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <div className={styles.chartLabel}>Number Of Asset Types</div>
              <div className={styles.chartValue}>
                <Icon type="cluster" className={styles.marginRight10} />
                {totalAssetTypes}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div className={`${styles.chart} ${styles.noLink}`}>
              <div className={styles.chartLabel}>Total KW</div>
              <div className={styles.chartValue}>
                <Icon type="thunderbolt" className={styles.marginRight10} />
                3,300
              </div>
              <div className={styles.chartUnit}>kw</div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div className={`${styles.chart} ${styles.noLink}`}>
              <div className={styles.chartLabel}>Total refrigerant</div>
              <div className={styles.chartValue}>
                <Icon type="cloud-download" className={styles.marginRight10} />
                2,125
              </div>
              <div className={styles.chartUnit}>kg</div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(StatisticsChart))
