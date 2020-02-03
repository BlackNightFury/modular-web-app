import { Icon } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { get } from 'lodash'
import AssetsCardList from '@/components/EliasMwaComponents/DataCollection/Components/AssetsCardList'
import AssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/AssetsTable'
import {
  filterData,
  findDetailsFromHierarchyTree,
  flattenToArray,
  resetAssets,
  sort,
  filterAssetTypeTreeData,
  getAssetClasses,
  filterKeysGrouping,
  makeCustomerUrl,
  getSorter,
  getAdditionalAssetFilter,
} from '@/services/utils'
import { getViewMode } from '@/services/user'
import defaultAssetDetailsGenerator from '@/services/sample-data'
import CommonPage, {
  renderCollapseComponent,
} from '@/components/EliasMwaComponents/DataCollection/Pages/CommonPage'

import styles from './style.scss'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'

const columns = [
  {
    title: 'Name',
    dataIndex: 'type',
    key: 'type',
    editable: true,
    width: '40%',
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
    title: 'Manufacturer',
    dataIndex: 'facets.manufacturer',
    key: 'manufacturer',
    editable: true,
    width: '5%',
    className: styles.hiddenMd,
    sorter: (a, b) =>
      get(a, 'facets.manufacturer', '').localeCompare(get(b, 'facets.manufacturer', '')),
  },
  {
    title: 'Asset ID',
    dataIndex: 'facets.barcode',
    key: 'barcode',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXl}`,
    sorter: (a, b) => get(a, 'facets.barcode', '').localeCompare(get(b, 'facets.barcode', '')),
  },
  {
    title: 'Install date',
    dataIndex: 'facets.install-date',
    key: 'installDate',
    editable: true,
    width: '5%',
    render: text => text && getBrowserLocaledDateTimeString(text),
    className: `${styles.rightAlign} ${styles.hiddenXl}`,
    sorter: (a, b) =>
      get(a, 'facets.install-date', '').localeCompare(get(b, 'facets.install-date', '')),
  },
  {
    title: 'Condition',
    dataIndex: 'facets.condition',
    key: 'condition',
    editable: true,
    width: '5%',
    className: styles.hiddenXxl,
    sorter: (a, b) => get(a, 'facets.condition', '').localeCompare(get(b, 'facets.condition', '')),
  },
  {
    title: 'Qty',
    dataIndex: 'facets.quantity',
    key: 'quantity',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXxl}`,
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => get(a, 'facets.quantity', 0) - get(b, 'facets.quantity', 0),
  },
  {
    title: 'Last edited',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '5%',
    className: `${styles.rightAlign} ${styles.borderRightNone} ${styles.hiddenSm}`,
    render: text => text && getBrowserLocaledDateTimeString(text, true),
    sorter: (a, b) => a.createdAt && a.createdAt.localeCompare(b.createdAt),
  },
]

class Antd extends CommonPage {
  intervalID = null

  state = {
    type: '',
    selectedAssetDetail: {},
    createdItem: {},
    selectedItem: {},
    isEditing: false,
    viewMode: getViewMode(),
    highlighted: null,
    drawerVisible: false,
    sortOption: {
      isAscending: false,
      field: 'createdAt',
    },
    isVirtual: false,
    showPreSurvey: false,
    filterKeys: [],
  }

  componentWillUnmount() {
    if (this.intervalID) {
      clearTimeout(this.intervalID)
      this.intervalID = null
    }
  }

  setInitialData = manufacturers => {
    const { treeData } = this.props
    const { type } = this.state

    this.setState({
      createdItem: defaultAssetDetailsGenerator(
        flattenToArray(findDetailsFromHierarchyTree(type, treeData).facets),
        manufacturers,
      ),
    })
  }

  onFilterKeysChanged = values => {
    this.setState({ filterKeys: values })
  }

  onGoAsset = record => {
    const { history } = this.props
    history.push(
      makeCustomerUrl(
        record.projectId,
        record.facilityId,
        record.floorId,
        record.spaceId,
        record.id,
      ),
    )
  }

  render() {
    const { viewMode, highlighted, sortOption, isVirtual, filterKeys } = this.state
    const {
      treeData,
      sites,
      facilities,
      floors,
      spaces,
      assets,
      user,
      spaceName,
      isVAInSpace,
    } = this.props
    const newAssets = resetAssets(treeData, assets, isVAInSpace)
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
    if (isVAInSpace) {
      filteredAssetTypeTreeData.push(getAssetClasses(filteredAssetTypeTreeData[0].children))
    }

    const sortedData = sort(filteredAssets, getSorter(sortOption), sortOption.isAscending, true)

    const newColumns = columns.map(column => {
      if (isVAInSpace && column.dataIndex === 'type') {
        return {
          ...column,
          render: assetType => (
            <span className={styles.nameStyle}>
              {assetType.virtual ? <Icon type="bulb" /> : <Icon type="wallet" />}
              <a className={styles.detailLinkMargin}>{assetType.value}</a>
            </span>
          ),
        }
      }
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })

    const tableContent = (
      <div className={styles.assetsConainer}>
        {viewMode ? (
          <AssetsTable
            columns={newColumns}
            data={sortedData}
            onPressItem={this.onGoAsset}
            onUpdate={this.onUpdate}
            onChangeSortBy={this.onChangeSortBy}
            isVirtualAssets={isVirtual}
            highlighted={highlighted}
            isVAInSpace={isVAInSpace}
          />
        ) : (
          <AssetsCardList
            data={sortedData}
            onDelete={this.onDelete}
            onEdit={() => {}}
            tenant={user.tenant}
            isVAInSpace={isVAInSpace}
            isVirtualAssets={isVirtual}
          />
        )}
      </div>
    )

    return (
      <div>
        <Helmet title="Assets" />
        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              dataTestSelector: 'add_asset',
              showFilterByBtn: true,
              treeData: filteredAssetTypeTreeData,
              showInstallDateRangePicker: true,
              showEoLRangeFilter: true,
            })}
            {renderCollapseComponent({
              styles,
              key: 'assets',
              headerCurrent: 'Assets',
              headerParent: spaceName,
              numberOfResults: assets.length,
              tableContent,
            })}
          </div>
        </section>
      </div>
    )
  }
}

export default Antd
