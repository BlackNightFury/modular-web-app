import React from 'react'
import { Icon, DatePicker } from 'antd'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'
import styles from './style.scss'
import {
  filterKeysGrouping,
  getLevelsFromHierarchyTree,
  excludeDateFilters,
  enabledDateFilterKeys,
  INSTALL_DATE,
  EOL,
} from '@/services/utils'

const { RangePicker } = DatePicker

class FilterByButton extends React.Component {
  state = {
    pickingDateRange: false,
    installDateRange: ['', ''],
    installDateRangeValue: [],
    EoLRange: ['', ''],
    EoLRangeValue: [],
  }

  onOpenChangeDateRange = status => {
    setTimeout(() => {
      this.setState({ pickingDateRange: status })
    }, 100)
  }

  onChangeInstallDateRange = (date, dateString) => {
    this.setState({ installDateRange: dateString, installDateRangeValue: date }, () => {
      const { filterKeys } = this.props
      this.handleFilterKeyChange(filterKeys, true)
    })
  }

  onChangeEoLRange = (date, dateString) => {
    this.setState({ EoLRange: dateString, EoLRangeValue: date }, () => {
      const { filterKeys } = this.props
      this.handleFilterKeyChange(filterKeys, true)
    })
  }

  handleFilterKeyChange = (filterKeys, touchedDateFilter) => {
    const {
      onFilterKeysChanged,
      treeData,
      showEoLRangeFilter,
      showInstallDateRangePicker,
    } = this.props
    const { installDateRange, EoLRange } = this.state

    const newFilterKeys = excludeDateFilters(filterKeys)
    const filterKeyGroups = filterKeysGrouping(newFilterKeys)

    const assetType = {
      trees: filterKeyGroups.type.reduce((prev, obj) => {
        const cur = getLevelsFromHierarchyTree(obj, treeData)
        prev.push(cur.tree)
        return prev
      }, []),
    }
    if (filterKeyGroups.class.length === 1) {
      assetType.class = filterKeyGroups.class[0].endsWith('Virtual') ? 'VIRTUAL' : 'CORE'
    } else {
      assetType.class = 'ALL'
    }
    const { type, class: tmpClass, ...rest } = filterKeyGroups
    const normalizedFilter = { assetType, ...rest }
    const dateFilterKeys = enabledDateFilterKeys(filterKeys)
    if (showInstallDateRangePicker && installDateRange[0].length) {
      if (touchedDateFilter || dateFilterKeys[INSTALL_DATE]) {
        newFilterKeys.push({
          type: INSTALL_DATE,
          range: installDateRange,
        })
      } else {
        this.setState({ installDateRange: ['', ''], installDateRangeValue: [] })
      }
    }
    if (showEoLRangeFilter && EoLRange[0].length) {
      if (touchedDateFilter || dateFilterKeys[EOL]) {
        newFilterKeys.push({
          type: EOL,
          range: EoLRange,
        })
      } else {
        this.setState({ EoLRange: ['', ''], EoLRangeValue: [] })
      }
    }
    onFilterKeysChanged(newFilterKeys, normalizedFilter)
  }

  onFilterKeysChanged = filterKeys => {
    this.handleFilterKeyChange(filterKeys, false)
  }

  render() {
    const {
      treeData,
      setShowFilterState,
      showFilter,
      filterKeys,
      showEoLRangeFilter,
      showInstallDateRangePicker,
    } = this.props
    const { pickingDateRange, installDateRangeValue, EoLRangeValue } = this.state

    const newTreeData = [...treeData]

    const dateRangeFilter = {
      key: 'date-ranges',
      selectable: false,
      title: 'Date Range',
      value: 'date-ranges',
      children: [],
    }

    if (showInstallDateRangePicker) {
      dateRangeFilter.children.push({
        title: 'Install date',
        key: 'install-date',
        value: 'install-date',
        children: [
          {
            className: 'no-highlight-treeselect-item',
            title: (
              <RangePicker
                className={styles.customRangePicker}
                onOpenChange={this.onOpenChangeDateRange}
                onChange={this.onChangeInstallDateRange}
                value={installDateRangeValue}
              />
            ),
            key: 'install-date-range',
            value: 'install-date-range',
            selectable: false,
          },
        ],
        selectable: false,
      })
    }

    if (showEoLRangeFilter) {
      dateRangeFilter.children.push({
        title: 'Lifecycle',
        key: 'lifecycle',
        value: 'lifecycle',
        children: [
          {
            className: 'no-highlight-treeselect-item',
            title: (
              <RangePicker
                className={styles.customRangePicker}
                onOpenChange={this.onOpenChangeDateRange}
                onChange={this.onChangeEoLRange}
                value={EoLRangeValue}
              />
            ),
            key: 'lifecycle-date-range',
            value: 'lifecycle-date-range',
            selectable: false,
          },
        ],
        selectable: false,
      })
    }

    if (showInstallDateRangePicker || showEoLRangeFilter) {
      newTreeData.push(dateRangeFilter)
    }

    const standardFilterKeys = filterKeys.map(key => {
      if (typeof key !== 'object') {
        return key
      }
      return `${key.type} - ${key.range[0].split('-')[0]} to ${key.range[1].split('-')[0]}`
    })

    return (
      <div
        className={`${styles.groupContainer} ${showFilter && styles.openFilter}`}
        data-test-selector="filterbybutton_container"
      >
        <SearchableTree
          className={styles.searchableTree}
          placeholder="Filter by asset type, class"
          treeData={newTreeData}
          onChange={this.onFilterKeysChanged}
          multiple
          treeNodeLabelProp="value"
          data-test-selector="filterbybutton_searchabletree"
          value={standardFilterKeys}
          pickingDateRange={pickingDateRange}
        />
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

export default FilterByButton
