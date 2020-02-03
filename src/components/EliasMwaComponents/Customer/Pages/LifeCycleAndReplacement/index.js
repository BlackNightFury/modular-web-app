import React from 'react'
import { Row, Col, Switch, Icon } from 'antd'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { get } from 'lodash'
import CommonPage from '@/components/EliasMwaComponents/DataCollection/Pages/CommonPage'
import LifecycleAndReplacementListing from '../../Components/LifecycleAndReplacementListing'
import LifecycleAndReplacementDashboard from '../../Components/LifecycleAndReplacementDashboard'
import {
  resetAssets,
  filterKeysGrouping,
  filterData,
  filterAssetTypeTreeData,
  getAssetClasses,
  getAdditionalAssetFilter,
} from '@/services/utils'
import { getViewMode, getDashboardViewMode, setDashboardViewMode } from '@/services/user'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import styles from './style.scss'

export const columns = [
  {
    title: 'Name + Qty',
    dataIndex: 'type',
    key: 'type',
    editable: true,
    width: '20%',
    sorter: (a, b) => {
      const aTypeValue = `${
        a.assetType && a.assetType.description ? a.assetType.description : ''
      }, ${a.facets.quantity}`
      const bTypeValue = `${
        b.assetType && b.assetType.description ? b.assetType.description : ''
      }, ${b.facets.quantity}`

      return aTypeValue.localeCompare(bTypeValue)
    },
    render: text => text && text.value,
    className: styles.firstColumn,
  },
  {
    title: 'Cost',
    dataIndex: 'spons.replacementCost',
    key: 'replacementCost',
    editable: true,
    width: '5%',
    className: `${styles.borderRightNone} ${styles.hiddenXs}`,
    sorter: (a, b) =>
      get(a, 'spons.replacementCost', '').localeCompare(get(b, 'spons.replacementCost', '')),
  },
  {
    title: 'EoL',
    dataIndex: 'spons.eol',
    key: 'spons.eol',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.borderRightNone} ${styles.hiddenSm}`,
    render: text => text && getBrowserLocaledDateTimeString(text),
    sorter: (a, b) => a.spons.eol && a.spons.eol.localeCompare(b.spons.eol),
  },
  {
    title: 'Cond.',
    dataIndex: 'facets.condition',
    key: 'condition',
    editable: true,
    width: '5%',
    className: styles.hiddenMd,
    sorter: (a, b) => get(a, 'facets.condition', '').localeCompare(get(b, 'facets.condition', '')),
  },
  {
    title: 'Criticality',
    dataIndex: 'facets.criticality',
    key: 'criticality',
    editable: true,
    width: '5%',
    className: `${styles.borderRightNone} ${styles.hiddenMd}`,
    sorter: (a, b) =>
      get(a, 'facets.criticality', '').localeCompare(get(b, 'facets.criticality', '')),
  },
  {
    title: 'Maint req.',
    dataIndex: 'facets.maintenance-requirement',
    key: 'maintenanceRequirement',
    editable: true,
    width: '5%',
    className: styles.hiddenXxl,
    sorter: (a, b) =>
      get(a, 'facets.maintenance-requirement', '').localeCompare(
        get(b, 'facets.maintenance-requirement', ''),
      ),
  },
  {
    title: 'Facility',
    dataIndex: 'facility',
    key: 'facility',
    editable: true,
    width: '5%',
    className: `${styles.facilityColumn} ${styles.borderRightNone} ${styles.hiddenXl}`,
    sorter: (a, b) => a.facility && a.facility.localeCompare(b.facility),
  },
  {
    title: 'System',
    dataIndex: 'system',
    key: 'system',
    editable: true,
    width: '5%',
    className: styles.hiddenXxl,
    sorter: (a, b) => a.system && a.system.localeCompare(b.system),
  },
  {
    title: 'Manufacturer',
    dataIndex: 'facets.manufacturer',
    key: 'manufacturer',
    editable: true,
    width: '5%',
    className: `${styles.manufacturerColumn} ${styles.hiddenXxl}`,
    sorter: (a, b) =>
      get(a, 'facets.manufacturer', '').localeCompare(get(b, 'facets.manufacturer', '')),
  },
  {
    title: 'Model',
    dataIndex: 'facets.model',
    key: 'model',
    editable: true,
    width: '5%',
    className: `${styles.borderRightNone} ${styles.hiddenXxl}`,
    sorter: (a, b) => get(a, 'facets.model', '').localeCompare(get(b, 'facets.model', '')),
  },
]

const mapStateToProps = ({ report }) => ({ report })
@connect(mapStateToProps)
class Antd extends CommonPage {
  state = {
    totalViewMode: getDashboardViewMode(),
    viewMode: getViewMode(),
    sortOption: {
      isAscending: true,
      field: 'type',
    },
    filterKeys: [],
    normalizedFilter: {},
    showFilter: true,
    isVirtual: false,
  }

  onChangeTotalViewMode = totalViewMode => {
    setDashboardViewMode(totalViewMode)
    this.setState({ totalViewMode })
  }

  onFMRReport = () => {}

  onFilterKeysChanged = (values, normalizedFilter) => {
    this.setState({ filterKeys: values, normalizedFilter })
  }

  render() {
    const {
      totalViewMode,
      viewMode,
      sortOption,
      filterKeys,
      normalizedFilter,
      isVirtual,
    } = this.state
    const { treeData, sites, projects, facilities, floors, spaces, assets } = this.props

    const newAssets = resetAssets(treeData, assets, true)
    const filterKeyGroup = filterKeysGrouping(filterKeys)
    const filteredAssets = filterData(newAssets, filterKeyGroup, {
      sites,
      facilities,
      floors,
      spaces,
    })
    let filteredAssetTypeTreeData = [
      {
        children: filterAssetTypeTreeData(treeData, assets),
        key: 'asset-type',
        selectable: false,
        title: 'Asset type',
        value: 'asset-type',
      },
    ]

    filteredAssetTypeTreeData = filteredAssetTypeTreeData.concat(
      getAdditionalAssetFilter(assets, {
        sites,
        facilities,
        floors,
        spaces,
      }),
    )
    filteredAssetTypeTreeData.push(getAssetClasses(filteredAssetTypeTreeData[0].children))

    return (
      <div>
        <Helmet title="Lifecycle And Replacement Costs Dashboard" />
        {this.renderWarningCards({
          showReportWarning: true,
        })}
        <section className="card">
          <div className="card-body">
            <Row gutter={16}>
              <Col xs={24} sm={16} className={styles.dashboardTitle}>
                <span className={styles.dashboardLabel}>Dashboard&nbsp;</span>
                <span className={styles.LifeCycleDashboardLabel}>
                  - Lifecycle And Replacement Costs | 10 years
                </span>
              </Col>
              <Col xs={24} sm={8} className={styles.dashboardViewSwitch}>
                <Switch
                  data-test-selector="lifecycle_viewswitch"
                  className={styles.switch}
                  onChange={this.onChangeTotalViewMode}
                  checked={totalViewMode}
                  checkedChildren={<Icon type="unordered-list" />}
                  unCheckedChildren={<Icon type="dashboard" />}
                />
              </Col>
            </Row>
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: null,
              dataTestSelector: '',
              showFilterByBtn: true,
              treeData: filteredAssetTypeTreeData,
              hideCardSwitch: !totalViewMode,
              showExportBtn: true,
              showFMRReportBtn: true,
              hideSortByBtn: !totalViewMode,
              onExport: () => {},
              onFMRReport: this.onFMRReport,
              showInstallDateRangePicker: true,
              showEoLRangeFilter: true,
            })}
            {totalViewMode ? (
              <LifecycleAndReplacementListing
                viewMode={viewMode}
                columns={columns}
                sortOption={sortOption}
                onChangeSortBy={this.onChangeSortBy}
                treeData={treeData}
                projects={projects}
                facilities={facilities}
                floors={floors}
                spaces={spaces}
                filteredAssets={filteredAssets}
                filterKeys={filterKeys}
                isVirtual={isVirtual}
                onEdit={this.onEdit}
                data-test-selector="lifecycle_listingview"
              />
            ) : (
              <LifecycleAndReplacementDashboard
                filter={normalizedFilter}
                data-test-selector="lifecycle_dashboardview"
              />
            )}
          </div>
        </section>
      </div>
    )
  }
}

export default Antd
