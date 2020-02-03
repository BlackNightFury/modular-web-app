import React from 'react'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import { renderItemWithInfo } from '../Common'

const mapStateToProps = ({ user }) => ({ user })

@withRouter
@connect(mapStateToProps)
class AnalyticsModule extends React.Component {
  goToDashboard = link => () => {
    const {
      history,
      user: { authenticatedBy },
      closeContextPanelOnSmallDevices,
    } = this.props
    history.push(`${authenticatedBy === 'demo' ? '/clickable-prototype' : ''}/analytics/${link}`)
    closeContextPanelOnSmallDevices()
  }

  render() {
    const {
      user: { authenticatedBy },
    } = this.props
    return (
      <>
        {renderItemWithInfo(
          'Asset Management Dashboard',
          'barcode',
          '',
          this.goToDashboard('asset-management'),
          'asset_management_dashboard_link',
        )}
        {authenticatedBy === 'demo' &&
          renderItemWithInfo(
            'Asset replacement costs dashboard',
            'bank',
            '',
            this.goToDashboard('asset-replacement'),
            'asset_replacement_costs_dashboard_link',
          )}
        {renderItemWithInfo(
          'Lifecycle And Replacement Costs Dashboard',
          'bank',
          '',
          this.goToDashboard('lifecycle-and-replacement'),
          'lifecycle_and_replacement_costs_dashboard_link',
        )}
      </>
    )
  }
}

export default AnalyticsModule
