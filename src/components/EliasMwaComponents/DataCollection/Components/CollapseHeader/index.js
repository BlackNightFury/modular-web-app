import * as React from 'react'

const CollapseHeader = ({ current, parent, numberOfResults, updatedTime }) => (
  <div className="collapse-header-container">
    <span>
      {current} {parent ? <span>- {parent}</span> : ''}
    </span>
    <span>
      {`${numberOfResults} results`}
      {updatedTime ? ` - ${updatedTime}` : ''}
    </span>
  </div>
)

export default CollapseHeader
