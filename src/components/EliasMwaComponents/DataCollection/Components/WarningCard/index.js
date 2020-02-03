import React from 'react'
import { Alert, Icon } from 'antd'
import classNames from 'classnames'
import styles from './style.scss'

class WarningCard extends React.Component {
  componentDidMount() {
    const { isComplete, completedInfo, dispatch } = this.props

    if (isComplete && dispatch && completedInfo) {
      dispatch({
        type: 'completion/DATA_COMPLETED_CARD_ENABLED',
        payload: {
          id: completedInfo.id,
        },
      })
    }
  }

  render() {
    const {
      show,
      message,
      description,
      type = 'info',
      showIcon,
      dataTestSelector,
      closable,
      onClose,
      className,
    } = this.props
    const isCreateForm = type === 'create-form'

    return show ? (
      <section
        className={classNames(
          'card',
          className,
          isCreateForm && styles['create-form-error-container'],
        )}
        data-test-selector={dataTestSelector}
      >
        <Alert
          message={<span className={classNames(styles.message, styles[type])}>{message}</span>}
          description={<span className={styles.description}>{description}</span>}
          type={type}
          showIcon={showIcon}
          closable={closable}
          onClose={onClose}
          closeText={
            !isCreateForm && (
              <Icon type="close" className={classNames(styles.closeIcon, styles[type])} />
            )
          }
        />
      </section>
    ) : (
      <></>
    )
  }
}
export default WarningCard
