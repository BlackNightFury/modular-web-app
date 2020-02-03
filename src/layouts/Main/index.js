import React from 'react'
import { BackTop, Layout } from 'antd'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import classNames from 'classnames'
import TopBar from '@/components/LayoutComponents/TopBar'
import Menu from '@/components/LayoutComponents/Menu'
import Footer from '@/components/LayoutComponents/Footer'
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs'
import Settings from '@/components/LayoutComponents/Settings'

const mapStateToProps = ({ settings }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
})

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  render() {
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
    } = this.props
    return (
      <Layout
        className={classNames({
          settings__borderLess: isBorderless,
          settings__squaredBorders: isSquaredBorders,
          settings__fixedWidth: isFixedWidth,
          settings__menuShadow: isMenuShadow,
          settings__menuTop: isMenuTop,
        })}
      >
        <BackTop />
        <Menu />
        <Settings />
        <Layout>
          <Layout.Header>
            <TopBar />
          </Layout.Header>
          <Layout.Content style={{ height: '100%', position: 'relative' }}>
            <Breadcrumbs />
            <div className="utils__content">{children}</div>
          </Layout.Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    )
  }
}

export default MainLayout
