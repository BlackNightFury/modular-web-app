import 'rc-drawer/assets/index.css'
import React from 'react'
import DrawerMenu from 'rc-drawer'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'

const mapStateToProps = ({ settings }) => ({
  isMenuTop: settings.isMenuTop,
  isMobileMenuOpen: settings.isMobileMenuOpen,
  screenSize: settings.screenSize,
  isLightTheme: settings.isLightTheme,
})

@withRouter
@connect(mapStateToProps)
class AppMenu extends React.Component {
  toggleOpen = () => {
    const { dispatch, isMobileMenuOpen } = this.props
    document
      .querySelector('#root')
      .setAttribute(
        'style',
        !isMobileMenuOpen ? 'overflow: hidden; width: 100%; height: 100%;' : '',
      )
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    })
  }

  render() {
    const { isMenuTop, isMobileMenuOpen, screenSize, isLightTheme } = this.props
    const BootstrappedMenu = () => {
      if (screenSize === 'md' || screenSize === 'sm' || screenSize === 'xs') {
        return (
          <DrawerMenu
            getContainer={null}
            level="all"
            open={isMobileMenuOpen}
            onMaskClick={this.toggleOpen}
            onHandleClick={this.toggleOpen}
            className={isLightTheme ? 'drawer-light' : ''}
            handler={false}
          >
            <MenuLeft />
          </DrawerMenu>
        )
      }
      if (isMenuTop) {
        return <MenuTop />
      }
      return <MenuLeft />
    }

    return BootstrappedMenu()
  }
}

export default AppMenu
