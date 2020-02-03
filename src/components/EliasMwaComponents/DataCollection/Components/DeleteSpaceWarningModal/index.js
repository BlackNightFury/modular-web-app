import React from 'react'
import { Modal, Button, Icon, Checkbox } from 'antd'
import styles from './style.scss'

class DeleteSpaceWarningModal extends React.Component {
  state = {
    deleteEnabled: false,
  }

  render() {
    const { onConfirm, onCancel, assets } = this.props
    const { deleteEnabled } = this.state

    return (
      <Modal
        visible
        className={styles.confirmModal}
        title={
          <>
            <Icon type="warning" className={styles.confirmModalIcon} />
            <span data-test-selector="delete_space_confirm_title">
              You are about to delete a space
            </span>
          </>
        }
        onCancel={onCancel}
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            className={styles.secondaryButton}
            disabled={!deleteEnabled}
            onClick={onConfirm}
            data-test-selector="delete_space_confirm_button"
          >
            Delete space
          </Button>,
          <Button key="back" className={styles.tertiaryButton} onClick={onCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div>
          If you delete this space you will permanently lose all data for this space and all records
          in this space.
          {assets > 0 && ` There are ${assets} assets in this space, they will be deleted.`}
        </div>
        <div className={styles.confirmCheckBox}>
          <Checkbox
            value={deleteEnabled}
            onChange={event => this.setState({ deleteEnabled: event.target.checked })}
            data-test-selector="delete_space_confirm_checkbox"
          >
            I understand I can not recover this space and the asset once deleted
          </Checkbox>
        </div>
      </Modal>
    )
  }
}

export default DeleteSpaceWarningModal
