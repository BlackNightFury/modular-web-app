import React from 'react'
import { Button, Icon } from 'antd'
import style from './style.scss'

class Action extends React.Component {
  state = {
    showDeleteConfirm: false,
    showSuccessInfo: false,
  }

  componentWillUnmount = () => {
    if (this.successInfoInterval) {
      clearInterval(this.successInfoInterval)
    }
  }

  showDeleteConfirm = () => {
    this.setState({ showDeleteConfirm: true })
  }

  confirmDeleteCurrentImage = () => {
    const { onDeleteImage } = this.props
    this.setState({ showSuccessInfo: true, showDeleteConfirm: false })
    onDeleteImage()
    this.successInfoInterval = setTimeout(() => {
      this.setState({ showSuccessInfo: false })
    }, 2000)
  }

  cancelDeleteCurrentImage = () => {
    this.setState({ showDeleteConfirm: false })
  }

  render() {
    const { showDeleteConfirm, showSuccessInfo } = this.state

    return (
      <div className={style.actionContainer}>
        {!showDeleteConfirm && !showSuccessInfo && (
          <Button
            className={style.deleteImgBtn}
            onClick={() => this.showDeleteConfirm()}
            data-test-selector="phototaker_delete_image_button"
          >
            Delete
          </Button>
        )}
        {showDeleteConfirm && (
          <>
            <div className={style.confirmMessage} data-test-selector="delete_confirm_message">
              You will not be able to recover this image, are you sure?
            </div>
            <div className={style.confirmActions}>
              <Button
                className={style.confirmDeleteButton}
                onClick={() => this.confirmDeleteCurrentImage()}
                data-test-selector="phototaker_delete_confirm_button"
              >
                Yes delete <Icon type="close" />
              </Button>
              <Button
                className={style.cancelDeleteButton}
                onClick={() => this.cancelDeleteCurrentImage()}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
        {showSuccessInfo && (
          <div className={style.successMessage}>
            <Icon type="check-circle" />
            <span className={style.successText}>Success: Previous image deleted</span>
          </div>
        )}
      </div>
    )
  }
}

export default Action
