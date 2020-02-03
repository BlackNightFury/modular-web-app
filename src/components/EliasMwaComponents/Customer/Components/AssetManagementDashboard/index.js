import React from 'react'
import { Row, Col } from 'antd'
import { Helmet } from 'react-helmet'
import ConditionByFacilityChart from '../ConditionByFacilityChart'
import AssetsBySystemAndTypeChart from '../AssetsBySystemAndTypeChart'
import StatisticsChart from '../StatisticsChart'
import styles from './style.scss'

class AssetManagementDashboard extends React.Component {
  render() {
    const { filter, goToAssetManagementListing } = this.props

    return (
      <div>
        <Helmet title="Dashboard - Asset Management" />
        <Row gutter={16} type="flex" className={styles.marginBottom10}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <StatisticsChart goToAssetManagementListing={goToAssetManagementListing} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <AssetsBySystemAndTypeChart
              filter={filter}
              goToAssetManagementListing={goToAssetManagementListing}
            />
          </Col>
        </Row>
        <ConditionByFacilityChart filter={filter} />
      </div>
    )
  }
}

export default AssetManagementDashboard
