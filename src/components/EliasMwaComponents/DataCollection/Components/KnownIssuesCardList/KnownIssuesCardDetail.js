import React, { Component } from 'react'
import { Button, Tooltip } from 'antd'
import styles from './style.scss'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'

const ButtonGroup = Button.Group

class KnownIssuesCardDetail extends Component {
  render() {
    const { itemData, onEdit, isOdd } = this.props

    return (
      <div className={`${styles.descriptionContainer} ${isOdd && styles.highlightedBackground}`}>
        <div className={styles.vImageContainer}>
          <p>
            <Tooltip placement="topLeft" title="Name">
              <span className={styles.fontSize14}>{itemData.name}</span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Type">
              <span className={styles.fontSize13}>{itemData.type}</span>
            </Tooltip>
          </p>
          <p>
            <Tooltip placement="topLeft" title="Issue">
              <span className={styles.fontSize14}>{itemData.issue}</span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Project">
              <span className={styles.fontSize13}>{itemData.project}</span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Location">
              <span className={styles.fontSize13}>{itemData.location}</span>
            </Tooltip>
          </p>
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.vCardInfoContainer}>
            <Tooltip placement="topLeft" title="Last edited">
              <span className={styles.fontSize13}>
                {getBrowserLocaledDateTimeString(itemData.createdAt, true, true)}
              </span>
            </Tooltip>
          </div>
          <div className={styles.vActionButtons}>
            <ButtonGroup>
              <Button onClick={onEdit} data-test-selector="assetscard_action_button">
                Edit
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    )
  }
}

export default KnownIssuesCardDetail
