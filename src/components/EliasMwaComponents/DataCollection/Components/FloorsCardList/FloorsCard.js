import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'dva'
import { mappingStatusText, mappingStatusVisualIndicator } from '@/services/utils'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import { FloorSecondaryActions } from '../FloorsTable'

import styles from './style.scss'

const mapStateToProps = ({ user }) => ({ authUser: user })
@connect(mapStateToProps)
class FloorsCard extends Component {
  render() {
    const { data, isOdd, index } = this.props
    const text = data.status
    let indicatorText = text
    if (
      text === 'DONE' &&
      data.subSpaces &&
      data.subSpaces.find(subSpace => subSpace.status === 'INACCESSIBLE')
    ) {
      indicatorText = 'INACCESSIBLE'
    }

    return (
      <div
        className={classNames(styles.cardContainer, { [styles.highlightedBackground]: isOdd })}
        data-test-selector="floor_card"
      >
        <div className={styles.paragraph}>
          <div>
            <span className={styles.floorName}>{data.name}</span>&nbsp;-&nbsp;
            <span className={styles.projectName}>{data.project.name}</span>
          </div>
          <div>
            <div className={styles.visualStatusIndicator}>
              {mappingStatusVisualIndicator[indicatorText]}
            </div>
            <div className={styles.statusText}>
              {text && mappingStatusText[text]}
              {data.completedAt && (
                <span className={styles.marginLeft10}>
                  {getBrowserLocaledDateTimeString(data.completedAt, true)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.paragraph}>
          <div>Spaces: {data.spaces}</div>
          <div>Assets: {data.assets}</div>
          <div>Virtual assets: {data.virtualAssets}</div>
        </div>

        <div className={styles.cardDetails}>
          <div className={styles.vCardInfoContainer}>
            <span className={styles.fontSize12}>
              {getBrowserLocaledDateTimeString(data.createdAt, true, true)}
            </span>
          </div>
          <div className={styles.vActionButtons}>
            {FloorSecondaryActions(data, data, index, this.props)}
          </div>
        </div>
      </div>
    )
  }
}

export default FloorsCard
