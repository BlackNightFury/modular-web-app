import React from 'react'
import { connect } from 'dva'
import { Layout, Icon } from 'antd'
import styles from './style.scss'

const { Sider } = Layout

const mapStateToProps = ({ settings }) => ({
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isMediumView: settings.isMediumView,
  screenSize: settings.screenSize,
  isSettingsOpen: settings.isSettingsOpen,
  isLightTheme: settings.isLightTheme,
  isMobileMenuOpen: settings.isMobileMenuOpen,
})

@connect(mapStateToProps)
class LoginMenuLeft extends React.Component {
  state = {}

  onCollapse = (value, type) => {
    const { dispatch, isMenuCollapsed } = this.props
    if (type === 'responsive' && isMenuCollapsed) {
      return
    }

    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })
  }

  render() {
    const { isMenuCollapsed, isLightTheme } = this.props

    const collapsedClass = isMenuCollapsed ? 'menu-fold' : 'menu-unfold'

    return (
      <Sider
        width="100%"
        collapsedWidth="100%"
        className={`${styles.menu} ${collapsedClass} ${isLightTheme && styles.light}`}
        data-test-selector="left-hand-drawer"
      >
        <div className={styles.collapseContainer}>
          <div className={styles.iconContainer} onClick={this.onCollapse} role="presentation">
            <Icon type={collapsedClass} />
          </div>
        </div>
        <div className={`${styles.layout}`}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>ELIAS Asset Management System</div>

            <div className={styles.headerContent}>
              ELIAS Saas technology provides customers with cutting edge asset management solutions
              from tablet based data collection to configurable life cycle planning portals, risk
              analysis and BI reporting
            </div>
            <div className={styles.headerContent}>
              For access please contact{' '}
              <span className={styles.contactEmail}>it@realestateams.com</span>
            </div>
          </div>
          <div className={`${styles.footer} text-center`}>
            <div>Copyright &copy; 2019 REAMS (GB) Ltd</div>
            <div>{window.buildDate}</div>
          </div>
        </div>
      </Sider>
    )
  }
}

export default LoginMenuLeft
