import React from 'react'
import style from './style.scss'

const MAX_IMAGES_COUNT = 5

class Validation extends React.Component {
  state = {
    showMaxLengthError: false,
  }

  componentWillUnmount = () => {
    if (this.maxLenErrInterval) {
      clearInterval(this.maxLenErrInterval)
    }
  }

  handleValidationForAdd = () => {
    const { photos } = this.props
    const { showMaxLengthError } = this.state

    if (photos.length >= MAX_IMAGES_COUNT) {
      if (!showMaxLengthError) {
        this.setState({ showMaxLengthError: true })
        this.maxLenErrInterval = setTimeout(() => {
          this.setState({ showMaxLengthError: false })
        }, 5000)
      }
      return true
    }
    return false
  }

  render() {
    const { showMaxLengthError } = this.state
    const { photos } = this.props

    if (photos.length === 0) {
      return <div />
    }
    return (
      <div
        className={style.validationContainer}
        data-test-selector="maximum_image_validation_message"
      >
        {showMaxLengthError && photos.length === MAX_IMAGES_COUNT && (
          <div className={style.confirmMessage}>
            You already have the maximum number of images, 5.
          </div>
        )}
      </div>
    )
  }
}

export default Validation
