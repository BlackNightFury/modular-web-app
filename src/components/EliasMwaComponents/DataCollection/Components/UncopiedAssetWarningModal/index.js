import React from 'react'
import { Modal, Button, Icon } from 'antd'
import styles from './style.scss'

class UncopiedAssetWarningModal extends React.Component {
  render() {
    const { visible, onConfirm, onCancel, totalAssets, spaceName } = this.props

    return (
      <Modal
        visible={visible}
        className={styles.confirmModal}
        title={
          <>
            <Icon type="exclamation-circle" className={styles.confirmModalIcon} />
            <span data-test-selector="stop_copy_asset_confirm_title">
              You have unfinished assets
            </span>
          </>
        }
        onCancel={onCancel}
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            className={styles.secondaryButton}
            onClick={onConfirm}
            data-test-selector="stop_copy_asset_confirm_button"
          >
            Exit copy and delete {totalAssets} assets
          </Button>,
          <Button key="back" className={styles.tertiaryButton} onClick={onCancel}>
            Continue copy
          </Button>,
        ]}
      >
        <div className={styles.logoutModalInfo}>
          If you exit the copy asset workflow you will lose all assets. There are {totalAssets}{' '}
          assets, none of these will be copied to {spaceName}
        </div>
      </Modal>
    )
  }
}

export default UncopiedAssetWarningModal
