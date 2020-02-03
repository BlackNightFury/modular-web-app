import React, { Component } from 'react'
import { Storage } from 'aws-amplify'
import { Menu, Icon, Tooltip } from 'antd'
import ExifImage from '@/components/EliasMwaComponents/Host/ExifImage'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import AssetSecondaryActions from '../AssetSecondaryActions'
import { updateStorage } from '@/services/utils'

import styles from './style.scss'

const { aws } = window.mwa_config

const getTitle = subType =>
  subType
    .split('-')
    .slice(0, -1)
    .join('-')

class AssetsCardDetail extends Component {
  state = {
    imgSource: null,
  }

  componentDidMount() {
    this.userInput.addEventListener('mouseup', this.stopPropagation)
    this.userInput.addEventListener('mousedown', this.stopPropagation)
    this.userInput.addEventListener('touchstart', this.stopPropagation)
    this.userInput.addEventListener('touchend', this.stopPropagation)
    this.setImageSource()
  }

  componentDidUpdate(prevProps) {
    const { itemData } = this.props
    if (itemData !== prevProps.itemData) {
      this.setImageSource()
    }
  }

  componentWillUnmount() {
    this.userInput.removeEventListener('mouseup', this.stopPropagation)
    this.userInput.removeEventListener('mousedown', this.stopPropagation)
    this.userInput.removeEventListener('touchstart', this.stopPropagation)
    this.userInput.removeEventListener('touchend', this.stopPropagation)
  }

  onSelectMenu = ({ key, domEvent }) => {
    const { onDelete } = this.props

    domEvent.stopPropagation()
    switch (key) {
      case 'delete_asset':
        onDelete()
        break
      default:
        break
    }
  }

  setImageSource = () => {
    const { tenant, itemData } = this.props
    if (itemData.images && itemData.images.length) {
      let imgSource = itemData.images[0].dataUri
      if (!itemData.images[0].dataUri) {
        updateStorage(tenant, aws.project_region)
        Storage.get(itemData.images[0].picture.key, { download: true, level: 'public' }).then(
          response => {
            const arrayBufferView = new Uint8Array(response.Body)
            const blob = new Blob([arrayBufferView], { type: response.ContentType })
            const urlCreator = window.URL || window.webkitURL
            imgSource = urlCreator.createObjectURL(blob)
            this.setState({
              imgSource,
            })
          },
        )
      }
      this.setState({
        imgSource,
      })
    }
  }

  stopPropagation = e => {
    e.stopPropagation()
  }

  render() {
    const { itemData, onEdit, isVAInSpace, isOdd, isCopyAssets } = this.props
    const { imgSource } = this.state
    const menu = () => (
      <Menu onClick={this.onSelectMenu}>
        {!isCopyAssets && <Menu.Item key="copy_asset">Copy</Menu.Item>}
        {!isCopyAssets && <Menu.Item key="active_asset">Active</Menu.Item>}
        <Menu.Item key="delete_asset">Delete</Menu.Item>
      </Menu>
    )

    return (
      <div
        className={`${styles.descriptionContainer} ${isOdd && styles.highlightedBackground}`}
        data-test-selector="asset_card"
        ref={userInput => {
          this.userInput = userInput
        }}
      >
        <div className={styles.vImageContainer}>
          <ExifImage className={styles.vImage} src={imgSource} alt="Assets Placeholder" />
          <p>
            <Tooltip placement="topLeft" title="Asset type">
              <span className={styles.fontSize14}>
                {isVAInSpace && <Icon className={styles.assetClassIcon} type="wallet" />}
                {isVAInSpace ? getTitle(itemData.type.value) : getTitle(itemData.type)}
              </span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Manufacturer">
              <span className={styles.fontSize13}>{itemData.facets.manufacturer}</span>
            </Tooltip>
          </p>
          <p>
            <Tooltip placement="topLeft" title="Barcode">
              <span className={styles.fontSize14}>{itemData.facets.barcode}</span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Install date">
              <span className={styles.fontSize13}>
                {getBrowserLocaledDateTimeString(itemData.facets['install-date'])}
              </span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Quantity">
              <span className={styles.fontSize13}>Qty: {itemData.facets.quantity}</span>
            </Tooltip>
          </p>
          <p>
            <Tooltip placement="topLeft" title="Condition">
              <span className={styles.fontSize13}>Condition: {itemData.facets.condition}</span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Condition description">
              <span className={styles.fontSize13}>
                {itemData.notes && itemData.notes.condition}
              </span>
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
            <AssetSecondaryActions
              onClick={onEdit}
              dataTestSelectorAction="assetscard_action_button"
              dropdownOverlay={menu()}
              placement="bottomRight"
              dataTestSelectorEllipsis="assetscard_action_dropdown"
              dropdownClick={event => event.stopPropagation()}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default AssetsCardDetail
