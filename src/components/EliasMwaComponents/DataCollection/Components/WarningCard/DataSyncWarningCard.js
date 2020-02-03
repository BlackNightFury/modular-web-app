import React from 'react'
import WarningCard from '.'

const DataSyncWarningCard = ({ indicator }) => (
  <WarningCard
    message="Warning"
    description={
      indicator === 'amber'
        ? 'Please allow your work to sync at the earliest opportunity'
        : 'Please ensure you sync your work before the end of the day'
    }
    type="warning"
    showIcon
    show={indicator !== 'green'}
    dataTestSelector="data-sync-warning-card"
  />
)

export default DataSyncWarningCard
