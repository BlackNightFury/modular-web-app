import React from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import { Layout, Icon, Collapse } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import MenuLeftGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/MenuLeftGQLWrapper'
import { hasRole } from '@/services/user'

import Logo from '@/assets/images/Elias_Pink.png'
import { renderPanelHeader } from './Modules/Common'

import SearchModule from './Modules/Search'
import AnalyticsModule from './Modules/Analytics'
import MyEstateModule from './Modules/MyEstate'
import MyWorkModule from './Modules/MyWork'
import ValidationModule from './Modules/Validation'

import styles from './style.scss'

const { Panel } = Collapse
const { Sider } = Layout

const mapStateToProps = ({ settings, user }) => ({
  user,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isMediumView: settings.isMediumView,
  screenSize: settings.screenSize,
  isLightTheme: settings.isLightTheme,
  isMobileMenuOpen: settings.isMobileMenuOpen,
})

@connect(mapStateToProps)
class MenuLeft extends React.Component {
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

  onToggleMenu = () => {
    const { dispatch, isMobileMenuOpen, isMediumView } = this.props
    if (!isMediumView) {
      this.onCollapse()
      return
    }
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    })
  }

  onExpandChange = key => {
    const { dispatch } = this.props

    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'contextPanelActiveKey',
        value: key,
      },
    })
  }

  closeContextPanelOnSmallDevices = () => {
    const { dispatch, isMobileMenuOpen, isMediumView } = this.props
    if (isMediumView) {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isMobileMenuOpen',
          value: !isMobileMenuOpen,
        },
      })
    }
  }

  render() {
    const {
      isMediumView,
      isMobileMenuOpen,
      screenSize,
      isMenuCollapsed,
      isLightTheme,
      user: { roles },
      project: { name: projectName },
      settings: { contextPanelActiveKey },
    } = this.props

    const menuSettings = isMediumView
      ? {
          width: '100%',
          collapsedWidth: '100%',
          collapsible: false,
          collapsed: false,
          onCollapse: this.onCollapse,
        }
      : {
          width: '100%',
          collapsedWidth: '100%',
          collapsible: false,
          collapsed: isMenuCollapsed,
          onCollapse: this.onCollapse,
          breakpoint: 'lg',
        }

    const isCustomer = hasRole(roles, 'customer')
    const menuCollapsed = (isMediumView && isMobileMenuOpen) || (!isMediumView && !isMenuCollapsed)

    return (
      <Sider
        {...menuSettings}
        className={isLightTheme ? `${styles.menu} ${styles.light}` : styles.menu}
        data-test-selector="left-hand-drawer"
        {...(isCustomer ? { trigger: null } : {})}
      >
        <Scrollbars
          className={classNames(
            screenSize === 'sm' || screenSize === 'xs'
              ? styles.scrollbarMobile
              : styles.scrollbarDesktop,
            { [styles.customer]: isCustomer },
          )}
          autoHide
        >
          <div className={styles.menuContainer} data-test-selector="customer-menu-left">
            <div
              className={classNames(styles.header, {
                [styles.collapsed]: !isMediumView && isMenuCollapsed,
              })}
            >
              <img src={Logo} alt="logo" />
              <div
                className={styles.iconContainer}
                role="presentation"
                onClick={this.onToggleMenu}
                data-test-selector="toggleButton"
              >
                <Icon
                  type={menuCollapsed ? 'menu-fold' : 'menu-unfold'}
                  className={styles.collapseIcon}
                />
              </div>
            </div>
            <div className={styles.content}>
              {!isMediumView && isMenuCollapsed ? (
                <>
                  <div className={styles.iconOnlyItemContainer}>
                    <div className={styles.itemIconContainer}>
                      <Icon type="search" className={styles.itemIcon} />
                    </div>
                  </div>
                  {isCustomer && (
                    <div className={styles.iconOnlyItemContainer}>
                      <div className={styles.itemIconContainer}>
                        <Icon type="team" className={styles.itemIcon} />
                      </div>
                    </div>
                  )}
                  {isCustomer && (
                    <div className={styles.iconOnlyItemContainer}>
                      <div className={styles.itemIconContainer}>
                        <Icon type="bar-chart" className={styles.itemIcon} />
                      </div>
                    </div>
                  )}
                  {!isCustomer && (
                    <div className={styles.iconOnlyItemContainer}>
                      <div className={styles.itemIconContainer}>
                        <Icon type="team" className={styles.itemIcon} />
                      </div>
                    </div>
                  )}
                  {!isCustomer && (
                    <div className={styles.iconOnlyItemContainer}>
                      <div className={styles.itemIconContainer}>
                        <Icon type="exclamation-circle" className={styles.itemIcon} />
                      </div>
                    </div>
                  )}
                  {/* <div className={styles.iconOnlyItemContainer}>
                    <div className={styles.itemIconContainer}>
                      <Icon type="message" className={styles.itemIcon} />
                    </div>
                  </div>
                  <div className={styles.iconOnlyItemContainer}>
                    <div className={styles.itemIconContainer}>
                      <Icon type="schedule" className={styles.itemIcon} />
                    </div>
                  </div> */}
                </>
              ) : (
                <Collapse
                  expandIconPosition="right"
                  className={projectName ? undefined : styles.hiddenChevron}
                  expandIcon={({ isActive }) => (
                    <Icon type="caret-up" rotate={isActive ? 0 : 180} />
                  )}
                  onChange={this.onExpandChange}
                  defaultActiveKey={contextPanelActiveKey}
                >
                  <SearchModule
                    isCustomer={isCustomer}
                    closeContextPanelOnSmallDevices={this.closeContextPanelOnSmallDevices}
                  />
                  {isCustomer && (
                    <Panel
                      header={renderPanelHeader('My Estate', 'profile', 'contextpanel_estate_link')}
                      key="myestate"
                    >
                      <MyEstateModule
                        closeContextPanelOnSmallDevices={this.closeContextPanelOnSmallDevices}
                      />
                    </Panel>
                  )}
                  {isCustomer && (
                    <Panel
                      header={renderPanelHeader(
                        'Analytics',
                        'bar-chart',
                        'contextpanel_analytics_link',
                      )}
                      key="analytics"
                    >
                      <AnalyticsModule
                        closeContextPanelOnSmallDevices={this.closeContextPanelOnSmallDevices}
                      />
                    </Panel>
                  )}
                  {!isCustomer && (
                    <Panel
                      header={renderPanelHeader(
                        projectName || 'My Work',
                        'team',
                        'contextpanel_work_link',
                        projectName,
                      )}
                      key="mywork"
                    >
                      <MyWorkModule
                        closeContextPanelOnSmallDevices={this.closeContextPanelOnSmallDevices}
                      />
                    </Panel>
                  )}
                  {!isCustomer && (
                    <Panel
                      header={renderPanelHeader(
                        'Validation',
                        'exclamation-circle',
                        'contextpanel_validation_link',
                        projectName,
                      )}
                      key="validation"
                    >
                      {projectName && (
                        <ValidationModule
                          closeContextPanelOnSmallDevices={this.closeContextPanelOnSmallDevices}
                        />
                      )}
                    </Panel>
                  )}
                  {/* <Panel header={renderPanelHeader('Messaging', 'message', 'messaging_link')} />
                  <Panel header={renderPanelHeader('Schedule', 'schedule', 'schedule_link')} /> */}
                </Collapse>
              )}
            </div>
          </div>
        </Scrollbars>
      </Sider>
    )
  }
}

export default MenuLeftGQLWrapper(MenuLeft)
