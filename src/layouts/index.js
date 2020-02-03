import React, { Fragment } from 'react'
import Redirect from 'umi/redirect'
import { notification } from 'antd'
import { connect } from 'dva'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
import { hasRole } from '../services/user'
import PublicLayout from './Public'
import LoginLayout from './Login'
import MainLayout from './Main'
import EliasMwaLayout from './EliasMwa'
import Loader from '@/components/LayoutComponents/Loader'

const Layouts = {
  public: PublicLayout,
  login: LoginLayout,
  main: MainLayout,
  eliasMwa: EliasMwaLayout,
}

@connect(({ user, loading }) => ({ user, loading }))
class IndexLayout extends React.PureComponent {
  previousPath = ''

  componentDidUpdate(prevProps) {
    const { location } = this.props
    const { prevLocation } = prevProps
    if (location !== prevLocation) {
      window.scrollTo(0, 0)
    }

    const {
      user,
      location: { pathname },
    } = this.props

    const { authenticatedBy, authenticated } = user
    const isAuthorized =
      (pathname.startsWith('/clickable-prototype') && authenticatedBy === 'demo') ||
      (!pathname.startsWith('/clickable-prototype') && authenticatedBy !== 'demo')
    const layout = this.getLayout(pathname)

    if (layout !== 'login' && authenticated && !isAuthorized) {
      notification.warning({
        message: 'Not authorized',
        description: 'Sorry, you do not have access to the requested page.',
      })
    }
  }

  getHomeRedirect = (baseRoute, role) => {
    if (role === 'surveyor') return <Redirect to={`${baseRoute}/data-collection/home`} />
    if (role === 'admin') return <Redirect to={`${baseRoute}/admin/home`} />
    return <Redirect to={`${baseRoute}/home`} />
  }

  // Layout Rendering
  getLayout = pathname => {
    if (pathname === '/' || pathname === '/azure' || /^\/user(?=\/|$)/i.test(pathname)) {
      return 'login'
    }
    if (/^\/original-template(\/|$)/i.test(pathname)) {
      return 'main'
    }
    return 'eliasMwa'
  }

  render() {
    const {
      children,
      loading,
      location: { pathname, search },
      user,
    } = this.props

    // NProgress Management
    const currentPath = pathname + search
    if (currentPath !== this.previousPath || loading.global) {
      NProgress.start()
    }

    if (!loading.global) {
      NProgress.done()
      this.previousPath = currentPath
    }

    const Container = Layouts[this.getLayout(pathname)]
    const isUserAuthenticated = user.authenticated
    const { roles, authenticatedBy } = user
    const isUserLoading = loading.models.user
    const isLoginLayout = this.getLayout(pathname) === 'login'

    const BootstrappedLayout = () => {
      // show loader when user in check authorization process, not authenticated yet and not on login pages
      if (isUserLoading && !isUserAuthenticated && !isLoginLayout) {
        return <Loader />
      }
      // redirect to login page if current is not login page and user not authenticated
      if (!isLoginLayout && !isUserAuthenticated) {
        return <Redirect to="/user/login" />
      }

      if (pathname === '/' && !isUserAuthenticated) {
        return <Redirect to="/user/login" />
      }
      // redirect to main dashboard when user on login page and authenticated
      const isAuthorized =
        (pathname.startsWith('/clickable-prototype') && authenticatedBy === 'demo') ||
        (!pathname.startsWith('/clickable-prototype') && authenticatedBy !== 'demo')
      if ((isLoginLayout && isUserAuthenticated) || !isAuthorized) {
        let baseRoute = ''
        if (authenticatedBy === 'demo') {
          baseRoute = '/clickable-prototype'
        }
        // !IMPORTANT: This is just for proofing future. So will need more care

        // For now, as a work around we are using surveyor layout for the azure logged in user
        if (hasRole(roles, 'admin') && user.authenticatedBy !== 'azure') {
          return this.getHomeRedirect(baseRoute, 'admin')
        }

        if (hasRole(roles, 'surveyor') || user.authenticatedBy === 'azure') {
          return this.getHomeRedirect(baseRoute, 'surveyor')
        }
        return this.getHomeRedirect(baseRoute, 'customer')
      }

      // in other case render previously set layout
      return <Container>{children}</Container>
    }

    return (
      <Fragment>
        <Helmet titleTemplate="%s | Modular Web App" title="Modular Web App MVP" />
        {BootstrappedLayout()}
      </Fragment>
    )
  }
}

export default IndexLayout
