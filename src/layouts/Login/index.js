import React from 'react'
import { Layout } from 'antd'
import LoginMenu from '@/components/EliasMwaComponents/Navigation/LoginMenu'
import styles from './style.scss'

export default class LoginLayout extends React.PureComponent {
  render() {
    const { children } = this.props

    return (
      <Layout>
        <Layout.Content>
          <div className={styles.layout}>
            <LoginMenu />
            <div className={styles.content}>{children}</div>
          </div>
        </Layout.Content>
      </Layout>
    )
  }
}
