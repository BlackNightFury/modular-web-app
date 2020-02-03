import React from 'react'
import { Row, Col, Switch, Icon } from 'antd'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { get } from 'lodash'
import CommonPage from '@/components/EliasMwaComponents/DataCollection/Pages/CommonPage'
import AssetManagementListing from '../../Components/AssetManagementListing'
import AssetManagementDashboard from '../../Components/AssetManagementDashboard'
import EditAssetDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditAssetDrawer'
import EditVirtualAssetDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditVirtualAssetDrawer'
import {
  findDetailsFromHierarchyTree,
  resetAssets,
  filterKeysGrouping,
  filterData,
  filterAssetTypeTreeData,
  getAssetClasses,
  getAdditionalAssetFilter,
} from '@/services/utils'
import { getViewMode, getDashboardViewMode, setDashboardViewMode } from '@/services/user'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import ExportMessagePanel from '../../Components/ExportMessagePanel'

import styles from './style.scss'

export const columns = [
  {
    title: 'Name + Qty',
    dataIndex: 'type',
    key: 'type',
    editable: true,
    width: '20%',
    className: styles.firstColumn,
    sorter: (a, b) => {
      const aTypeValue = `${
        a.assetType && a.assetType.description ? a.assetType.description : ''
      }, ${a.facets.quantity}`
      const bTypeValue = `${
        b.assetType && b.assetType.description ? b.assetType.description : ''
      }, ${b.facets.quantity}`

      return aTypeValue.localeCompare(bTypeValue)
    },
  },
  {
    title: 'Status',
    dataIndex: 'facets.asset-status',
    key: 'assetStatus',
    editable: true,
    width: '5%',
    className: `${styles.borderRightNone} ${styles.hiddenXs}`,
    sorter: (a, b) =>
      get(a, 'facets.asset-status', '').localeCompare(get(b, 'facets.asset-status', '')),
  },
  {
    title: 'Cond.',
    dataIndex: 'facets.condition',
    key: 'condition',
    editable: true,
    width: '5%',
    className: `${styles.borderRightNone} ${styles.hiddenSm}`,
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
    className: styles.hiddenXl,
    sorter: (a, b) =>
      get(a, 'facets.maintenance-requirement', '').localeCompare(
        get(b, 'facets.maintenance-requirement', ''),
      ),
  },
  {
    title: 'EoL',
    dataIndex: 'facets.install-date',
    key: 'installDate',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.borderRightNone} ${styles.hiddenXl}`,
    render: text => text && getBrowserLocaledDateTimeString(text),
    sorter: (a, b) =>
      get(a, 'facets.install-date', '').localeCompare(get(b, 'facets.install-date', '')),
  },
  {
    title: 'Facility',
    dataIndex: 'facility',
    key: 'facility',
    editable: true,
    width: '5%',
    className: `${styles.borderRightNone} ${styles.hiddenXxl}`,
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
    className: `${styles.manufacturerColumn} ${styles.borderRightNone}`,
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
    normalizedFilter: {
      assetType: {
        class: 'ALL',
      },
    },
    showFilter: true,
    selectedAssetDetail: {},
    selectedItem: {},
    isEditing: false,
    isVirtual: false,
  }

  onChangeTotalViewMode = totalViewMode => {
    setDashboardViewMode(totalViewMode)
    this.setState({ totalViewMode })
  }

  onFilterKeysChanged = (values, normalizedFilter) => {
    this.setState({ filterKeys: values, normalizedFilter })
  }

  onEdit = item => {
    const { 'install-date': installDate, quantity, condition, ...restItem } = item
    const { treeData } = this.props
    const type = item.type.value
    const facet = findDetailsFromHierarchyTree(type, treeData)
    const newFacets = { ...restItem.facets }
    if (newFacets['install-date']) {
      newFacets['install-date'] = getBrowserLocaledDateTimeString(newFacets['install-date'])
    }
    this.setState({
      selectedItem: { ...restItem, facets: newFacets },
      selectedAssetDetail: facet,
      isEditing: true,
      isVirtual: item.type.virtual,
    })
  }

  onExportCAFM = () => {
    const {
      onGenerateReport,
      user: { tenantId },
    } = this.props
    const { normalizedFilter } = this.state

    onGenerateReport({
      tenantId,
      ...normalizedFilter,
    })
  }

  goToAssetManagementListing = options => {
    if (options.sortBy) {
      this.setState({
        totalViewMode: true,
        sortOption: {
          isAscending: true,
          field: options.sortBy,
        },
      })
    }
    if (options.filter) {
      this.setState({
        totalViewMode: true,
        filterKeys: options.filter.filterKeys,
        normalizedFilter: options.filter.normalizedFilter,
      })
    }
  }

  render() {
    const {
      totalViewMode,
      viewMode,
      sortOption,
      filterKeys,
      normalizedFilter,
      selectedItem,
      selectedAssetDetail,
      isEditing,
      isVirtual,
    } = this.state
    const { treeData, projects, facilities, floors, spaces, assets, sites, history } = this.props

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
      getAdditionalAssetFilter(assets, { sites, facilities, floors, spaces }),
    )
    filteredAssetTypeTreeData.push(getAssetClasses(filteredAssetTypeTreeData[0].children))

    return (
      <div>
        <Helmet title="Dashboard - Asset Management" />
        <ExportMessagePanel />
        <section className="card">
          <div className="card-body">
            <Row gutter={16}>
              <Col xs={24} sm={16} className={styles.dashboardTitle}>
                <span className={styles.dashboardLabel}>Dashboard&nbsp;</span>
                <span className={styles.assetManagementLabel}>- Asset Management</span>
              </Col>
              <Col xs={24} sm={8} className={styles.dashboardViewSwitch}>
                <Switch
                  data-test-selector="assetmanagement_viewswitch"
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
              showExportCAFMBtn: true,
              hideSortByBtn: !totalViewMode,
              onExport: () => {},
              onExportCAFM: this.onExportCAFM,
              showInstallDateRangePicker: true,
              showEoLRangeFilter: true,
            })}
            {totalViewMode ? (
              <AssetManagementListing
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
                history={history}
                data-test-selector="assetmanagement_listingview"
              />
            ) : (
              <AssetManagementDashboard
                filter={normalizedFilter}
                goToAssetManagementListing={this.goToAssetManagementListing}
                data-test-selector="assetmanagement_dashboardview"
              />
            )}
          </div>
        </section>
        {isVirtual ? (
          <EditVirtualAssetDrawer
            visible={isEditing}
            isVirtual={isVirtual}
            assetDetail={selectedAssetDetail}
            item={selectedItem}
            onClose={this.onCloseEditing}
            disabled
          />
        ) : (
          <EditAssetDrawer
            visible={isEditing}
            isVirtual={isVirtual}
            assetDetail={selectedAssetDetail}
            item={selectedItem}
            onClose={this.onCloseEditing}
            disabled
          />
        )}
      </div>
    )
  }
}

export default Antd
