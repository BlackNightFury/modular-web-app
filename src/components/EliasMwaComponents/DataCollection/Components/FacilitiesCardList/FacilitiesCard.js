import React, { Component } from 'react'
import classNames from 'classnames'
import { mappingStatusText, mappingStatusVisualIndicator } from '@/services/utils'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import { FacilitySecondaryActions } from '../FacilitiesTable'

import styles from './style.scss'

class FacilitiesCard extends Component {
  render() {
    const { data, isOdd, index } = this.props
    const text = data.status

    return (
      <div
        className={classNames(styles.cardContainer, { [styles.highlightedBackground]: isOdd })}
        data-test-selector="facility_card"
      >
        <div className={styles.paragraph}>
          <div>
            <span className={styles.facilityName}>{data.name}</span>&nbsp;-&nbsp;
            <span className={styles.postcode}>{data.facets.postcode}</span>&nbsp;-&nbsp;
            <span className={styles.projectName}>{data.project}</span>
          </div>
          <div>
            <div className={styles.visualStatusIndicator}>
              {data.isCompleted && mappingStatusVisualIndicator.DONE}
              {!data.isCompleted && text && mappingStatusVisualIndicator[text]}
            </div>
            <div className={styles.statusText}>
              {data.isCompleted && "I'm done"}
              {!data.isCompleted && text && mappingStatusText[text]}
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
        </div>

        <div className={styles.cardDetails}>
          <div className={styles.vCardInfoContainer}>
            <span className={styles.fontSize12}>
              {getBrowserLocaledDateTimeString(data.createdAt, true, true)}
            </span>
          </div>
          <div className={styles.vActionButtons}>
            {FacilitySecondaryActions(data, data, index, this.props)}
          </div>
        </div>
      </div>
    )
  }
}

export default FacilitiesCard
