import React from 'react'
import { Card, Menu } from 'antd'
import Swipeable from 'react-swipeable'
import { isMobile } from 'react-device-detect'
import styles from './style.scss'

class ActionCard extends React.Component {
  state = {
    isShowMenu: false,
  }

  onShowMenu = () => {
    const { menus } = this.props
    if (!menus) return
    this.setState({ isShowMenu: true })
  }

  onHideMenu = () => {
    this.setState({ isShowMenu: false })
  }

  render() {
    const {
      onSecondaryAction,
      onSelectMenu,
      children,
      menus,
      onPrimaryAction,
      ...restProps
    } = this.props
    const { isShowMenu } = this.state

    return (
      <Swipeable
        onSwipedLeft={onSecondaryAction}
        onSwipingRight={this.onShowMenu}
        onTap={e => {
          e.preventDefault()
          if (typeof onPrimaryAction === 'function') {
            onPrimaryAction()
          }
        }}
        preventDefaultTouchmoveEvent
        trackMouse={!isMobile}
        disabled={isShowMenu}
        stopPropagation
        delta={120}
        flickThreshold={1.0}
        style={{ width: '100%', height: '100%' }}
      >
        <Card
          bordered={false}
          className={styles.card}
          bodyStyle={{ padding: 0, height: '100%' }}
          {...restProps}
        >
          {children}
          {isShowMenu && (
            <div
              className={styles.menuContainer}
              onClick={this.onHideMenu}
              role="button"
              onKeyPress={this.onHideMenu}
              tabIndex="0"
            >
              <Menu className={styles.menu} onClick={onSelectMenu}>
                {menus.map(menu => (
                  <Menu.Item key={menu}>{menu}</Menu.Item>
                ))}
              </Menu>
            </div>
          )}
        </Card>
      </Swipeable>
    )
  }
}

export default ActionCard
