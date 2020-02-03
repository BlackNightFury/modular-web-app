import React from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import ProfileMenu from './ProfileMenu'
import Breadcrumbs from '@/components/EliasMwaComponents/Navigation/Breadcrumbs/Breadcrumbs'
import BreadcrumbsTest from '@/components/EliasMwaComponents/Navigation/Breadcrumbs/BreadcrumbsTest'
import styles from './style.scss'

class TopBar extends React.Component {
  render() {
    const {
      breadcrumbs,
      isTest,
      isSecondary,
      user: { status },
      store,
    } = this.props

    const { indicator, online } = status

    return (
      <div className={classNames(styles.topbar, { [styles.test]: isSecondary })}>
        {isTest ? (
          <BreadcrumbsTest breadcrumbs={breadcrumbs} isSecondary={isSecondary} />
        ) : (
          <Breadcrumbs store={store} />
        )}
        <div className="mr-auto" />
        <div className={styles.statusContainer}>
          <div
            className={classNames(
              styles.statusIndicator,
              { [styles.green]: indicator === 'green' },
              { [styles.amber]: indicator === 'amber' },
              { [styles.red]: indicator === 'red' },
            )}
          />
          <span data-test-selector="sync-status-text">
            {indicator === 'green' && `${online ? 'Live' : 'Offline'}`}
            {indicator === 'amber' && 'Not Synced'}
            {indicator === 'red' && 'Data Out Of Date'}
          </span>
        </div>
        <ProfileMenu store={store} />
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(TopBar)
