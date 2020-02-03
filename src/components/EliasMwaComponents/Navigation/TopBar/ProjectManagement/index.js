import React from 'react'
import { Menu, Dropdown } from 'antd'
import { formatMessage } from 'umi-plugin-locale/lib/locale'
import Link from 'umi/link'
import styles from './style.scss'

class ProjectManagement extends React.Component {
  render() {
    const menu = (
      <Menu selectable={false}>
        <span className={styles.title}>
          <strong>Active</strong>
        </span>
        <Menu.Item>
          <Link to="/">Project Management</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">User Interface Development</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">Documentation</Link>
        </Menu.Item>
        <span className={styles.title}>
          <strong>Inactive</strong>
        </span>
        <Menu.Item>
          <Link to="/">Marketing</Link>
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
          <i className={`${styles.icon} icmn-database`} />
          <span className="d-none d-xl-inline">
            <strong>{formatMessage({ id: 'topBar.projectManagement' })}</strong>
          </span>
        </div>
      </Dropdown>
    )
  }
}

export default ProjectManagement
