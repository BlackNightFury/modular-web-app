import React from 'react'
import { connect } from 'dva'
import { Menu, Dropdown, Avatar } from 'antd'
import classNames from 'classnames'
import { formatMessage } from 'umi-plugin-locale/lib/locale'
import { withApollo } from 'react-apollo'
import { clearCache } from '@/services/utils'
import UnsyncedWarningModal from './UnsyncedWarningModal'
import styles from './style.scss'

const tryRequire = path => {
  try {
    return require(path)
  } catch (err) {
    return null
  }
}

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  state = {
    count: 7,
    logoutModalVisible: false,
    enqueuedMutations: 0,
  }

  logout = () => {
    const { client: awsAppSyncClient, dispatch } = this.props
    const appSyncStore = awsAppSyncClient.cache.store.getState()
    const {
      'appsync-metadata': {
        snapshot: { enqueuedMutations },
      },
    } = appSyncStore

    if (enqueuedMutations > 0) {
      this.setState({
        logoutModalVisible: true,
        enqueuedMutations,
      })
    } else {
      dispatch({
        type: 'user/LOGOUT',
      })
      clearCache()
    }
  }

  continueLogout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
    clearCache()
  }

  handleGoback = () => {
    this.setState({ logoutModalVisible: false })
  }

  addCount = () => {
    let { count } = this.state
    count += 1
    this.setState({
      count,
    })
  }

  render() {
    const { user, className } = this.props

    const { logoutModalVisible, enqueuedMutations } = this.state

    const path =
      user.authenticatedBy !== 'demo'
        ? '@/assets/images/avatar.jpeg'
        : `@/assets/images/${user.tenantId ? user.tenantId : 'admin'}_avatar.jpeg`

    const tryImage = tryRequire(path)
    const avatar = tryImage || require('@/assets/images/unknown_avatar.png')

    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <strong>
            {formatMessage({ id: 'topBar.profileMenu.hello' })}, {user.name || 'Anonymous'}
          </strong>
          <div>
            <strong className="mr-1">
              {formatMessage({ id: 'topBar.profileMenu.billingPlan' })}:
            </strong>
            Professional
          </div>
          <div>
            <strong className="mr-1">{formatMessage({ id: 'topBar.profileMenu.role' })}:</strong>
            {user.roles.join(', ')}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div>
            <strong className="mr-1">{formatMessage({ id: 'topBar.profileMenu.email' })}:</strong>
            {user.email}
            <br />
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a
            data-test-selector="profile_logout_button"
            href="javascript: void(0);"
            onClick={this.logout}
          >
            <i className={`${styles.menuIcon} icmn-exit`} />
            {formatMessage({ id: 'topBar.profileMenu.logout' })}
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <>
        <Dropdown
          data-test-selector="profile_button"
          overlay={menu}
          trigger={['click']}
          onVisibleChange={this.addCount}
        >
          <div className={classNames(styles.dropdown, className)}>
            <Avatar
              className={styles.avatar}
              shape="square"
              size="large"
              icon="user"
              src={avatar}
              data-test-selector="profile_avatar"
            />
          </div>
        </Dropdown>
        <UnsyncedWarningModal
          logoutModalVisible={logoutModalVisible}
          enqueuedMutations={enqueuedMutations}
          continueLogout={this.continueLogout}
          handleGoback={this.handleGoback}
        />
      </>
    )
  }
}

export default withApollo(ProfileMenu)
