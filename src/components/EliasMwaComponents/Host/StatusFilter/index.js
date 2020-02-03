import React from 'react'
import { Select, Icon } from 'antd'
import { mappingStatusText } from '@/services/utils'
import styles from './style.scss'

const { Option } = Select

class StatusFilter extends React.Component {
  render() {
    const {
      statusFilter,
      statusList,
      onFilterChanged,
      placeholder,
      setShowFilterState,
      showFilter,
    } = this.props
    return (
      <div
        data-test-selector="status-filter"
        className={`${styles.groupContainer} ${showFilter && styles.openFilter}`}
      >
        {showFilter && (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={placeholder}
            onChange={onFilterChanged}
            value={statusFilter}
          >
            {statusList.map(status => (
              <Option key={status}>{mappingStatusText[status]}</Option>
            ))}
          </Select>
        )}
        <div
          className={styles.filterIconContainer}
          onClick={() => {
            setShowFilterState(!showFilter)
          }}
          onKeyPress={() => {}}
          role="presentation"
          data-test-selector="filtericon_container"
        >
          <Icon style={{ fontSize: '18px' }} className={styles.filterIcon} type="filter" />
        </div>
      </div>
    )
  }
}

export default StatusFilter
