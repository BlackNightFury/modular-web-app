import React from 'react'

import styles from './style.scss'

class ValidationMessage extends React.Component {
  state = {
    errorMessage: '',
  }

  setErrorMessage(errorMessage) {
    this.setState({ errorMessage })
  }

  render() {
    const { errorMessage } = this.state
    return (
      errorMessage !== '' && (
        <div className={`ant-form-explain ${styles.error}`}>{errorMessage}</div>
      )
    )
  }
}

export default ValidationMessage
