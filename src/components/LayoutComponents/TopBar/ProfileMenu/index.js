import React from 'react'
import { connect } from 'dva'
import { Menu, Dropdown, Avatar, Badge } from 'antd'
import { formatMessage } from 'umi-plugin-locale/lib/locale'
import styles from './style.scss'

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  state = {
    count: 7,
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  addCount = () => {
    let { count } = this.state
    count += 1
    this.setState({
      count,
    })
  }

  render() {
    const { user } = this.props
    const { count } = this.state
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
            {user.role}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div>
            <strong className="mr-1">{formatMessage({ id: 'topBar.profileMenu.email' })}:</strong>
            {user.email}
            <br />
            <strong className="mr-1">{formatMessage({ id: 'topBar.profileMenu.phone' })}:</strong>
            {user.phone || '-'}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript: void(0);">
            <i className={`${styles.menuIcon} icmn-user`} />
            {formatMessage({ id: 'topBar.profileMenu.editProfile' })}
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript: void(0);" onClick={this.logout}>
            <i className={`${styles.menuIcon} icmn-exit`} />
            {formatMessage({ id: 'topBar.profileMenu.logout' })}
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.addCount}>
        <div className={styles.dropdown}>
          <Badge count={count}>
            <Avatar className={styles.avatar} shape="square" size="large" icon="user" />
          </Badge>
        </div>
      </Dropdown>
    )
  }
}

export default ProfileMenu
