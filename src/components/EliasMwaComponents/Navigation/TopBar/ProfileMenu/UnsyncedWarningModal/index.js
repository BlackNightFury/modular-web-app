import React from 'react'
import { Modal, Button, Checkbox, Icon } from 'antd'
import styles from './style.scss'

class UnsyncedWarningModal extends React.Component {
  state = {
    logoutModalOkEnable: false,
  }

  render() {
    const { enqueuedMutations, logoutModalVisible, continueLogout, handleGoback } = this.props

    const { logoutModalOkEnable } = this.state

    return (
      <Modal
        visible={logoutModalVisible}
        className={styles.confirmModal}
        title={
          <>
            <Icon type="warning" className={styles.confirmModalIcon} />
            <span data-test-selector="profile_logout_confirm_title">
              Warning, irrecoverable data loss if you log out now
            </span>
          </>
        }
        onCancel={handleGoback}
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            className={styles.secondaryButton}
            disabled={!logoutModalOkEnable}
            onClick={continueLogout}
            data-test-selector="logout_and_delete_data"
          >
            Logout and delete data
          </Button>,
          <Button key="back" className={styles.tertiaryButton} onClick={handleGoback}>
            Go back
          </Button>,
        ]}
      >
        <div className={styles.modalInfo}>
          <b>You have unsynced data on this device</b>. If you log out now you will{' '}
          <b>lose {enqueuedMutations} unsaved records and will NOT be able to recover these</b>. You
          should connect and sync your data before logging out.
        </div>
        <div className={styles.logoutUnderstand}>
          <Checkbox
            value={logoutModalOkEnable}
            onChange={event => this.setState({ logoutModalOkEnable: event.target.checked })}
            data-test-selector="understand_logout_checkbox"
          >
            I understand I will lose my data and not be able to recover it. I still want to log out
            and delete this data.
          </Checkbox>
        </div>
      </Modal>
    )
  }
}

export default UnsyncedWarningModal
