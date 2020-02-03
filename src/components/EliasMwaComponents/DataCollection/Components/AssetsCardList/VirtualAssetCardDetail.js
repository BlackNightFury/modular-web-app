import React, { Component } from 'react'
import { Menu, Icon, Tooltip } from 'antd'
import { Storage } from 'aws-amplify'
import ExifImage from '@/components/EliasMwaComponents/Host/ExifImage'
import QuantityIncreaser from '../QuantitiyIncreaser'
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

class VirtualAssetsCardDetail extends Component {
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

  stopPropagation = e => {
    e.stopPropagation()
  }

  render() {
    const { itemData, onEdit, onAdd, isVAInSpace, readOnly, isOdd, isCopyAssets } = this.props
    const { imgSource } = this.state

    const menu = () => (
      <Menu onClick={this.onSelectMenu}>
        {!isCopyAssets && <Menu.Item key="copy_asset">Copy</Menu.Item>}
        {!isCopyAssets && <Menu.Item key="active_asset">Active</Menu.Item>}
        <Menu.Item key="delete_asset">Delete</Menu.Item>
      </Menu>
    )

    const isInvalidAsset = !(itemData.facets.condition && itemData.facets['install-date'])

    return (
      <div
        className={`${styles.descriptionContainer} ${isOdd && styles.highlightedBackground}`}
        data-test-selector="virtualasset_card"
        ref={userInput => {
          this.userInput = userInput
        }}
      >
        <div className={styles.vImageContainer}>
          {imgSource && (
            <ExifImage className={styles.vImage} src={imgSource} alt="Assets Placeholder" />
          )}
          <Tooltip placement="topLeft" title="Asset type">
            <p className={styles.fontSize14}>
              {isVAInSpace && <Icon className={styles.assetClassIcon} type="bulb" />}
              {isVAInSpace ? getTitle(itemData.type.value) : getTitle(itemData.type)}
            </p>
          </Tooltip>
          <p>
            <Tooltip placement="topLeft" title="Install date">
              <span className={styles.fontSize13}>
                {getBrowserLocaledDateTimeString(itemData.facets['install-date'])}
              </span>
            </Tooltip>
            <Tooltip placement="topLeft" title="Quantity">
              <span
                ref={userInput => {
                  this.userInput = userInput
                }}
                className={`${styles.fontSize13} ${styles.qtyIncreaserContainer}`}
              >
                Qty:{' '}
                <QuantityIncreaser
                  value={itemData.facets.quantity}
                  onChange={onAdd}
                  disabled={readOnly || isInvalidAsset}
                />
              </span>
            </Tooltip>
          </p>
          <Tooltip placement="topLeft" title="Condition">
            <p className={styles.fontSize13}>Condition: {itemData.facets.condition}</p>
          </Tooltip>
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
              dataTestSelectorAction="virtualassetscard_action_button"
              dropdownOverlay={menu()}
              placement="bottomRight"
              dataTestSelectorEllipsis="virtualassetscard_action_dropdown"
              dropdownClick={event => event.stopPropagation()}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default VirtualAssetsCardDetail
