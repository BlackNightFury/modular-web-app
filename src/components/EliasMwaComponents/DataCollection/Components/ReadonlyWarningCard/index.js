import React from 'react'
import PSQWarningCard from '../WarningCard/PSQWarningCard'
import WarningCard from '../WarningCard'

const ReadonlyWarningCard = ({ readOnly, readOnlyReason, onShowPSQ }) => {
  if (!readOnly) {
    return <></>
  }

  switch (readOnlyReason) {
    case 'PSQNotCompleted':
      return <PSQWarningCard onShowPSQ={onShowPSQ} show />
    case 'ProjectReadOnly':
      return (
        <WarningCard
          show
          type="info"
          message="This project is read only"
          description="This project can not be edited as editing has been restricted."
          dataTestSelector="project-read-only-warning-card"
          showIcon
        />
      )
    case 'FacilityCompleted':
      return (
        <WarningCard
          show
          type="info"
          message="This facility is read only"
          description="This facility can not be edited as it has been marked as done."
          dataTestSelector="facility-completed-read-only-warning-card"
          showIcon
        />
      )
    default:
      return <></>
  }
}

export default ReadonlyWarningCard
