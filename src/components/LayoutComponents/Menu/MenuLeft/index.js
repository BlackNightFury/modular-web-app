import React from 'react'
import { connect } from 'dva'
import { Link, withRouter } from 'dva/router'
import { Menu, Layout } from 'antd'
import store from 'store'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'
import styles from './style.scss'

const { Sider } = Layout
const { SubMenu, Divider } = Menu

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuLeftData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isSettingsOpen: settings.isSettingsOpen,
  isLightTheme: settings.isLightTheme,
  isMobileMenuOpen: settings.isMobileMenuOpen,
})

@withRouter
@connect(mapStateToProps)
class MenuLeft extends React.Component {
  state = {
    selectedKeys: store.get('app.menu.selectedKeys') || [],
    openedKeys: store.get('app.menu.openedKeys') || [],
  }

  componentWillMount() {
    this.setSelectedKeys(this.props)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isMenuCollapsed && !newProps.isMobileView) {
      this.setState({
        openedKeys: [],
      })
    }
    this.setSelectedKeys(newProps)
  }

  setSelectedKeys = props => {
    const { menuData } = this.props
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = _.find(flattenItems(menuData, 'children'), [
      'url',
      props.location.pathname,
    ])
    this.setState({
      selectedKeys: selectedItem ? [selectedItem.key] : [],
    })
  }

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

    this.setState({
      openedKeys: [],
    })
  }

  onOpenChange = openedKeys => {
    store.set('app.menu.openedKeys', openedKeys)
    this.setState({
      openedKeys,
    })
  }

  handleClick = e => {
    const { dispatch, isSettingsOpen, isMobileView, isMobileMenuOpen } = this.props
    store.set('app.menu.selectedKeys', [e.key])
    // close menu if mobile menu opened
    if (isMobileView) {
      setTimeout(() => {
        dispatch({
          type: 'settings/CHANGE_SETTING',
          payload: {
            setting: 'isMobileMenuOpen',
            value: !isMobileMenuOpen,
          },
        })
      }, 500)
    }
    // custom action on settings menu item
    if (e.key === 'settings') {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isSettingsOpen',
          value: !isSettingsOpen,
        },
      })
      return
    }
    this.setState({
      selectedKeys: [e.key],
      // openKeys: e.keyPath,
    })
  }

  generateMenuItems = () => {
    const { menuData = [] } = this.props
    const generateItem = item => {
      const { key, title, url, icon, disabled } = item
      if (item.divider) {
        return <Divider key={Math.random()} />
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target ? (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
              </a>
            ) : (
              <Link to={url}>
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          <span className={styles.title}>{title}</span>
          {icon && <span className={`${icon} ${styles.icon}`} />}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
            </span>
          )
          return (
            <SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          )
        }
        return generateItem(menuItem)
      })

    return menuData.map(menuItem => {
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            <span className={styles.title}>{menuItem.title}</span>
            {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
          </span>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  render() {
    const { selectedKeys, openedKeys } = this.state
    const { isMobileView, isMenuCollapsed, isLightTheme } = this.props
    const menuSettings = isMobileView
      ? {
          width: 256,
          collapsible: false,
          collapsed: false,
          onCollapse: this.onCollapse,
        }
      : {
          width: 256,
          collapsible: true,
          collapsed: isMenuCollapsed,
          onCollapse: this.onCollapse,
          breakpoint: 'lg',
        }

    const menu = this.generateMenuItems()

    return (
      <Sider
        {...menuSettings}
        className={isLightTheme ? `${styles.menu} ${styles.light}` : styles.menu}
      >
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <img
              src={`/resources/images/logo-inverse${menuSettings.collapsed ? '-mobile' : ''}.png`}
              alt=""
            />
          </div>
        </div>
        <Scrollbars
          className={isMobileView ? styles.scrollbarMobile : styles.scrollbarDesktop}
          autoHide
        >
          <Menu
            theme={isLightTheme ? 'light' : 'dark'}
            onClick={this.handleClick}
            selectedKeys={selectedKeys}
            openKeys={openedKeys}
            onOpenChange={this.onOpenChange}
            mode="inline"
            className={styles.navigation}
          >
            {menu}
          </Menu>
        </Scrollbars>
      </Sider>
    )
  }
}

export default MenuLeft
