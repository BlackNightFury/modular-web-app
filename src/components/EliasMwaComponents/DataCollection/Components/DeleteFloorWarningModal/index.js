import React from 'react'
import { Modal, Button, Icon } from 'antd'
import styles from './style.scss'

class DeleteFloorWarningModal extends React.Component {
  render() {
    const { onConfirm, onCancel, spaces, assets } = this.props

    return (
      <Modal
        visible
        className={styles.confirmModal}
        title={
          <>
            <Icon type="warning" className={styles.confirmModalIcon} />
            <span data-test-selector="delete_floor_confirm_title">
              You are about to delete a floor
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
            data-test-selector="delete_floor_confirm_button"
          >
            Delete floor
          </Button>,
          <Button key="back" className={styles.tertiaryButton} onClick={onCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div>
          If you delete this floor you will permanently lose all data for this floor, all child
          spaces and all asset records in these spaces.
          {spaces > 0 && (
            <span>
              <br />
              There are {spaces} spaces in this floor, they will be deleted.
            </span>
          )}
          {assets > 0 && (
            <span>
              <br />
              There are {assets} assets in this floor, they will be deleted.
            </span>
          )}
        </div>
      </Modal>
    )
  }
}

export default DeleteFloorWarningModal
