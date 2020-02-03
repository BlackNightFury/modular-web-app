import React from 'react'
import { Button } from 'antd'
import ContextPanelGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/ContextPanelGQLWrapper'
import { getQAErrors, getQAWarnings } from '@/services/qa'
import { runQA } from '@/services/task'
import { renderIcon } from '../Common'
import styles from './style.scss'

class ValidationModule extends React.Component {
  onRunQA = () => {
    const { allRecords, closeContextPanelOnSmallDevices } = this.props
    runQA(allRecords)
    closeContextPanelOnSmallDevices()
  }

  render() {
    return (
      <>
        <div className={styles.detailContainer}>
          <div className={styles.alertContainer}>
            <div data-test-selector="errors_count_contextpanel">
              <span className={`${styles.smallIconContainer} ${styles.slateGrey}`}>
                {renderIcon('empty-circle', '#F69898', '50%')}
              </span>
              <span className={`${styles.smallIconAfterText} ${styles.slateGrey}`}>
                {getQAErrors().length} errors
              </span>
            </div>
            <div data-test-selector="warnings_count_contextpanel">
              <span className={`${styles.smallIconContainer} ${styles.slateGrey}`}>
                {renderIcon('empty-circle', '#ffe2b4', '50%')}
              </span>
              <span className={`${styles.smallIconAfterText} ${styles.slateGrey}`}>
                {getQAWarnings().length} warnings
              </span>
            </div>
          </div>
          <Button
            onClick={this.onRunQA}
            className={styles.additionalButton}
            data-test-selector="context-panel-run-validator"
          >
            Run validator
          </Button>
        </div>
      </>
    )
  }
}

export default ContextPanelGQLWrapper(ValidationModule)
