import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'dva'
import { mappingStatusText, mappingStatusVisualIndicator } from '@/services/utils'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import { SpaceSecondaryActions } from '../SpacesTable'

import styles from './style.scss'

const mapStateToProps = ({ user }) => ({ user })
@connect(mapStateToProps)
class SpacesCard extends Component {
  render() {
    const { data, isOdd, index } = this.props

    return (
      <div
        className={classNames(styles.cardContainer, { [styles.highlightedBackground]: isOdd })}
        data-test-selector="space_card"
      >
        <div className={styles.paragraph}>
          <div>
            <span className={styles.spaceName}>
              {data.name}
              {data.localName && `(${data.localName})`}
              {data.department}
            </span>
            &nbsp;-&nbsp;
            <span className={styles.floorName}>{data.floorName}</span>&nbsp;-&nbsp;
            <span className={styles.projectName}>{data.projectName}</span>
          </div>
          <div>
            <div className={styles.visualStatusIndicator}>
              {mappingStatusVisualIndicator[data.status]}
            </div>
            <div className={styles.statusText}>
              {mappingStatusText[data.status]}
              {data.completedAt && (
                <span className={styles.marginLeft10}>
                  {getBrowserLocaledDateTimeString(data.completedAt, true)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.paragraph}>
          <div>{data.type}</div>
          <div>Assets: {data.assets}</div>
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.vCardInfoContainer}>
            <span className={styles.fontSize12}>
              {getBrowserLocaledDateTimeString(data.createdAt, true, true)}
            </span>
          </div>
          <div className={styles.vActionButtons}>
            {SpaceSecondaryActions(data, data, index, this.props)}
          </div>
        </div>
      </div>
    )
  }
}

export default SpacesCard
