import React from 'react'
import WarningCard from '.'

const PSQWarningCard = ({ show, onShowPSQ }) => (
  <WarningCard
    message="Warning"
    description={
      <>
        Please note, this facility is readonly until you complete the{' '}
        <a
          data-test-selector="show-facility-psq-link"
          className="showPreSurvey"
          href="javascript: void(0);"
          onClick={onShowPSQ}
        >
          pre survey questionnaire
        </a>
      </>
    }
    type="warning"
    showIcon
    show={show}
  />
)

export default PSQWarningCard
