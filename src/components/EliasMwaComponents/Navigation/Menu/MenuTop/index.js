import React from 'react'
import { connect } from 'dva'
import { Menu } from 'antd'
import Link from 'umi/link'
import withRouter from 'umi/withRouter'
import store from 'store'
import _ from 'lodash'
import styles from './style.scss'

const { SubMenu, Divider } = Menu

const mapStateToProps = ({ clickablemenu, settings }) => ({
  menuData: clickablemenu.menuTopData,
  isLightTheme: settings.isLightTheme,
  isSettingsOpen: settings.isSettingsOpen,
})

@withRouter
@connect(mapStateToProps)
class MenuTop extends React.Component {
  state = {
    selectedKeys: store.get('app.menu.selectedKeys') || [],
  }

  componentWillMount() {
    this.setSelectedKeys(this.props)
  }

  componentWillReceiveProps(newProps) {
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

  handleClick = e => {
    const { dispatch, isSettingsOpen } = this.props
    store.set('app.menu.selectedKeys', [e.key])
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
            <span className={styles.menu} key={menuItem.key}>
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
          <span className={styles.menu} key={menuItem.key}>
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
    const { selectedKeys } = this.state
    const { isLightTheme } = this.props
    return (
      <div>
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <img src="/resources/images/logo-inverse.png" alt="logo" />
          </div>
        </div>
        <Menu
          theme={isLightTheme ? 'light' : 'dark'}
          onClick={this.handleClick}
          selectedKeys={selectedKeys}
          mode="horizontal"
        >
          {this.generateMenuItems()}
        </Menu>
      </div>
    )
  }
}

export default MenuTop
