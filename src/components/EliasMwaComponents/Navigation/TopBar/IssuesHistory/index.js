import React from 'react'
import { Menu, Dropdown } from 'antd'
import { formatMessage } from 'umi-plugin-locale/lib/locale'
import Link from 'umi/link'
import styles from './style.scss'

class IssuesHistory extends React.Component {
  render() {
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <Link to="/">Current search</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">Search for issues</Link>
        </Menu.Item>
        <Menu.Divider />
        <span className={styles.title}>
          <strong>Opened</strong>
        </span>
        <Menu.Item>
          <Link to="/">
            <i className={`${styles.menuIcon} icmn-checkmark`} />
            CLNUI-253 Project implemen...
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">
            <i className={`${styles.menuIcon} icmn-checkmark`} />
            CLNUI-234 Active history iss...
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">
            <i className={`${styles.menuIcon} icmn-clock`} />
            CLNUI-424 Ionicons intergrat...
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">More...</Link>
        </Menu.Item>
        <Menu.Divider />
        <span className={styles.title}>
          <strong>Filters</strong>
        </span>
        <Menu.Item>
          <Link to="/">My open issues</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">Reported by me</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link to="/">
            <i className={`${styles.menuIcon} icmn-cog`} /> Settings
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
        <div className={styles.dropdown}>
          <i className={`${styles.icon} icmn-folder-open`} />
          <span className="d-none d-xl-inline">
            <strong>{formatMessage({ id: 'topBar.issuesHistory' })}</strong>
          </span>
        </div>
      </Dropdown>
    )
  }
}

export default IssuesHistory
