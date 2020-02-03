import React from 'react'
import classNames from 'classnames'
import { Select, Collapse, Switch, Button, Icon, Row, Col, Dropdown } from 'antd'
import FilterByButton from '@/components/EliasMwaComponents/Host/FilterByButton'
import SortByButton from '@/components/EliasMwaComponents/Host/SortByButton'
import StatusFilter from '@/components/EliasMwaComponents/Host/StatusFilter'
import { setViewMode } from '@/services/user'
import CollapseHeader from '../../Components/CollapseHeader'
import { mappingStatusVisualIndicator, mappingStatusText } from '@/services/utils'
import WithWarningCards from '../WithWarningCards'

import commonStyles from './style.scss'

const ButtonGroup = Button.Group
const { Option } = Select

const ConditionSurveyElHeader = ({ current, statusText, onAdd }) => (
  <div className="collapse-header-container">
    <div>
      <div
        className={`${commonStyles.visualStatusIndicator} ${commonStyles.conditionSurveyElHeader}`}
      >
        {mappingStatusVisualIndicator[statusText]}
      </div>
      <span
        className={`${commonStyles.textAfterStatusIndicator} ${commonStyles.conditionSurveyElHeader}`}
      >
        {current}
      </span>
    </div>
    <div
      className={commonStyles.headerPlusIcon}
      onClick={onAdd}
      role="button"
      onKeyPress={() => {}}
      tabIndex="0"
    >
      <Icon type="plus" />
    </div>
  </div>
)

export function renderConditionSurveyEl(options) {
  const {
    styles,
    key,
    expanded,
    statusText,
    headerCurrent,
    tableContent,
    onAddNew,
    onExpandChange,
  } = options
  const header = (
    <ConditionSurveyElHeader
      current={headerCurrent}
      statusText={statusText}
      onAdd={e => {
        e.stopPropagation()
        e.preventDefault()
        onAddNew()
      }}
    />
  )
  return (
    <div className={styles.conditionSurveyElContainer} key={key}>
      <Collapse
        expandIconPosition="right"
        expandIcon={({ isActive }) => <Icon type="up" rotate={isActive ? 180 : 0} />}
        onChange={onExpandChange}
        activeKey={expanded ? key : ''}
      >
        <Collapse.Panel key={key} header={header}>
          {tableContent}
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export function renderCollapseComponent(options) {
  const {
    styles,
    key,
    headerCurrent,
    headerParent,
    numberOfResults,
    tableContent,
    updatedTime,
  } = options
  return (
    <div className={styles.switchContainer}>
      <Collapse defaultActiveKey={key}>
        <Collapse.Panel
          header={
            <CollapseHeader
              current={headerCurrent}
              parent={headerParent}
              numberOfResults={numberOfResults}
              updatedTime={updatedTime}
            />
          }
          key={key}
        >
          {tableContent}
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

class Antd extends WithWarningCards {
  onChangeSortBy = (field, isAscending, sortFunction) => {
    if (field && isAscending) {
      this.setState({ sortOption: { isAscending, field, sortFunction } })
    } else {
      const { sortOption } = this.state
      this.setState({
        sortOption: {
          isAscending: field ? isAscending : !sortOption.isAscending,
          field: field || sortOption.field,
          sortFunction: sortFunction || sortOption.sortFunction,
        },
        isQtyUpdatedInCardView: false,
      })
    }
  }

  onChangeViewMode = viewMode => {
    setViewMode(viewMode)
    this.setState({ viewMode })
  }

  onPressItem = item => {
    this.setState({ selectedItem: { ...item }, isEditing: true })
  }

  onCloseEditing = () => {
    this.setState({ isEditing: false })
  }

  onConfirm = row => {
    const { onUpdate } = this.props
    onUpdate(row)
    this.setState({ isEditing: false })
  }

  showDrawer = () => {
    this.setState({ drawerVisible: true })
  }

  onClose = () => {
    this.setState({ drawerVisible: false })
  }

  onSecondaryDropdown = event => {
    event.stopPropagation()
  }

  renderStatusFilter(options) {
    const { statusFilter } = this.state
    const { statusList } = options
    return (
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select status filter"
        onChange={this.onStatusFilterChanged}
        value={statusFilter}
      >
        {statusList.map(status => (
          <Option key={status}>{mappingStatusText[status]}</Option>
        ))}
      </Select>
    )
  }

  setShowFilterState = isFilter => {
    this.setState({ showFilter: isFilter })
  }

  renderCardHeader(options) {
    const {
      columns,
      styles,
      addBtnTitle,
      dataTestSelector,
      showFilterByBtn,
      showStatusFilter,
      hideSortByBtn,
      statusList,
      treeData,
      onAdd,
      isCopyAssets,
      hideCardSwitch,
      showExportBtn,
      showExportCAFMBtn,
      showFMRReportBtn,
      onExport,
      onExportCAFM,
      onFMRReport,
      hasSecondaryAction,
      secondaryActions,
      secondaryActionDropdownSelector,
      showInstallDateRangePicker,
      showEoLRangeFilter,
    } = options
    const { readOnly } = this.props
    const { viewMode, sortOption, showFilter, filterKeys } = this.state
    let disabled = readOnly

    if (isCopyAssets) {
      const {
        user: {
          assetCopy: { copyAssets },
        },
      } = this.props
      disabled = readOnly || copyAssets.length === 0
      copyAssets.forEach(asset => {
        disabled = readOnly || asset.status !== 'DONE'
      })
    }

    return (
      <Row gutter={16} className={`card-header ${styles.optionRow}`}>
        <Col
          sm={24}
          md={16}
          className={classNames(styles.sortContainer, {
            [styles.openFilterInMobileView]: showFilter,
          })}
        >
          {showFilterByBtn && (
            <FilterByButton
              treeData={treeData}
              onFilterKeysChanged={this.onFilterKeysChanged}
              setShowFilterState={this.setShowFilterState}
              showFilter={showFilter}
              filterKeys={filterKeys}
              showInstallDateRangePicker={showInstallDateRangePicker}
              showEoLRangeFilter={showEoLRangeFilter}
            />
          )}
          {showStatusFilter && (
            <StatusFilter
              statusFilter={this.state.statusFilter}
              statusList={statusList}
              setShowFilterState={this.setShowFilterState}
              placeholder="Select status filter"
              showFilter={showFilter}
              onFilterChanged={this.onStatusFilterChanged}
            />
          )}
          {!hideSortByBtn && (
            <SortByButton
              sortBy={sortOption.field}
              isAscending={sortOption.isAscending}
              options={columns}
              onChangeSortBy={this.onChangeSortBy}
            />
          )}
        </Col>
        <Col sm={24} md={8} className={styles.CTAHeader}>
          <div className={styles.btnCTA}>
            {!hideCardSwitch && (
              <Switch
                data-test-selector="cardswitch"
                className={styles.switch}
                onChange={this.onChangeViewMode}
                checked={viewMode}
                checkedChildren={<Icon type="table" />}
                unCheckedChildren={<Icon type="database" />}
              />
            )}
            {addBtnTitle && (
              <ButtonGroup>
                <Button
                  className="primary-btn"
                  onClick={onAdd || this.showDrawer}
                  disabled={disabled}
                  data-test-selector={dataTestSelector}
                >
                  {addBtnTitle}
                </Button>
                {hasSecondaryAction && (
                  <Dropdown
                    disabled={disabled}
                    overlay={secondaryActions}
                    trigger={['click']}
                    onClick={this.onSecondaryDropdown}
                  >
                    <Button
                      className={classNames('primary-btn', styles.primaryActions)}
                      data-test-selector={secondaryActionDropdownSelector}
                    >
                      <div className={styles.tint} />
                      <Icon type="ellipsis" />
                    </Button>
                  </Dropdown>
                )}
              </ButtonGroup>
            )}
            {showExportBtn && (
              <Button
                className={styles.btnExport}
                onClick={onExport}
                data-test-selector="page-export-btn"
              >
                <Icon type="file-pdf" />
                Export
              </Button>
            )}
            {showExportCAFMBtn && (
              <Button
                className={classNames('primary-btn', styles.btnExportCAFM)}
                onClick={onExportCAFM}
                data-test-selector="page-export-cafm-btn"
              >
                Export CAFM
              </Button>
            )}
            {showFMRReportBtn && (
              <Button
                className={classNames('primary-btn', styles.btnExportCAFM)}
                onClick={onFMRReport}
                data-test-selector="page-export-cafm-btn"
              >
                FMR report
              </Button>
            )}
          </div>
        </Col>
      </Row>
    )
  }
}

export default Antd
