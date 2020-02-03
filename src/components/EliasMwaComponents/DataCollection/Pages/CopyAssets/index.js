import { Icon } from 'antd'
import React from 'react'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import _ from 'lodash'
import EditAssetDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditAssetDrawer'
import EditVirtualAssetDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditVirtualAssetDrawer'
import RouteLeavingGuard from '@/components/EliasMwaComponents/DataCollection/Components/RouteLeavingGuard'
import AssetListing from '@/components/EliasMwaComponents/DataCollection/Components/AssetListing'
import {
  filterData,
  filterAssetTypeTreeData,
  findDetailsFromHierarchyTree,
  resetAssets,
  getAssetClasses,
  filterKeysGrouping,
  makeSurveyUrl,
  getAdditionalAssetFilter,
} from '@/services/utils'
import { getViewMode } from '@/services/user'
import CommonPage from '../CommonPage'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import { getInstallDateFormat } from '@/services/asset-validation'

import styles from './style.scss'

export const columns = [
  {
    title: 'Name',
    dataIndex: 'type',
    key: 'type',
    editable: true,
    width: '20%',
    className: styles.firstColumn,
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: 'Manufacturer',
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    editable: true,
    width: '20%',
    sorter: (a, b) => a.manufacturer.localeCompare(b.manufacturer),
  },
  {
    title: 'Asset ID',
    dataIndex: 'barcode',
    key: 'barcode',
    editable: true,
    width: '5%',
    className: styles.rightAlign,
    sorter: (a, b) => a.barcode.localeCompare(b.barcode),
  },
  {
    title: 'Install date',
    dataIndex: 'install-date',
    key: 'installDate',
    editable: true,
    width: '5%',
    render: text => text && getBrowserLocaledDateTimeString(text),
    className: `${styles.rightAlign} ${styles.hiddenSm}`,
    sorter: (a, b) => a['install-date'] && a['install-date'].localeCompare(b['install-date']),
  },
  {
    title: 'Condition',
    dataIndex: 'condition',
    key: 'condition',
    editable: true,
    width: '5%',
    className: styles.hiddenMd,
    sorter: (a, b) => a.condition && a.condition.localeCompare(b.condition),
  },
  {
    title: 'Qty',
    dataIndex: 'quantity',
    key: 'quantity',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenMd}`,
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '5%',
    className: `${styles.borderRightNone} ${styles.hiddenXs}`,
    sorter: (a, b) => a.status && a.status.localeCompare(b.status),
  },
]

const mapStateToProps = ({ contentAreaNavigation, settings }) => ({
  contentAreaNavigation,
  isMobileView: settings.isMobileView,
})

class Antd extends CommonPage {
  state = {
    filterKeys: [],
    selectedAssetDetail: {},
    selectedItem: {},
    isEditing: false,
    viewMode: getViewMode(),
    highlighted: null,
    sortOption: {
      isAscending: false,
      field: 'type',
    },
    isVirtual: false,
    showFilter: true,
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
      isMobileView,
    } = this.props
    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: {
        project: params.projectName,
        facility: params.facilityName,
        floor: params.floorName,
        space: params.spaceName,
      },
    })

    this.setState({ showFilter: !isMobileView })
  }

  onEdit = item => {
    const { treeData, isVAInSpace } = this.props
    const type = isVAInSpace ? item.type.value : item.type
    const facet = findDetailsFromHierarchyTree(type, treeData)
    const newFacets = { ...item.facets }
    if (newFacets['install-date']) {
      newFacets['install-date'] = getBrowserLocaledDateTimeString(newFacets['install-date'])
    }
    this.setState({
      selectedItem: { ...item, facets: newFacets },
      selectedAssetDetail: facet,
      isEditing: true,
      isVirtual: item.type.virtual,
    })
  }

  onMenu = (key, itemData) => {
    if (key === 'Delete') {
      this.onDelete(itemData)
    } else {
      this.onEdit(itemData)
    }
  }

  onDelete = itemData => {
    const {
      dispatch,
      user: { assetCopy },
    } = this.props
    const { copyAssets } = assetCopy
    const updatedCopyAssets = copyAssets.filter(asset => {
      const facets = {
        ...asset.facets,
        condition: asset.facets.condition && asset.facets.condition.code,
      }
      return asset.type !== itemData.type || !_.isEqual(facets, itemData.facets)
    })
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        assetCopy: {
          ...assetCopy,
          copyAssets: updatedCopyAssets,
        },
      },
    })
  }

  onFilterKeysChanged = values => {
    this.setState({ filterKeys: values })
  }

  onUpdate = row => {
    const { 'install-date': installDate, quantity, condition, type, ...restItem } = row
    const {
      isVAInSpace,
      user: { assetCopy },
      dispatch,
    } = this.props
    const { copyAssets } = assetCopy
    const { selectedItem } = this.state
    let updatedItem
    if (isVAInSpace) {
      let newType = type === undefined ? undefined : type.value
      if (newType === undefined) {
        newType = selectedItem.type.value
      }
      delete restItem.virtual
      delete selectedItem.virtual

      updatedItem = {
        ...selectedItem,
        ...restItem,
        type: newType,
      }
    } else {
      updatedItem = { ...selectedItem, ...row }
    }
    const updatedCopyAssets = copyAssets.map(asset => {
      if (asset.type === updatedItem.type) {
        updatedItem.facets['install-date'] = moment(
          updatedItem.facets['install-date'],
          getInstallDateFormat(),
        )
          .toDate()
          .toISOString()
        return {
          ...asset,
          images: updatedItem.images,
          facets: updatedItem.facets,
          notes: updatedItem.notes,
          status: 'DONE',
        }
      }
      return asset
    })

    this.setState({ isEditing: false })
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        assetCopy: {
          ...assetCopy,
          copyAssets: updatedCopyAssets,
        },
      },
    })
  }

  addCopyAssets = () => {
    const {
      facilityId,
      floorId,
      spaceId,
      onAdd,
      allRecords,
      facility,
      project,
      dispatch,
      user: { assetCopy },
    } = this.props
    const { copyAssets } = assetCopy

    copyAssets.forEach(asset => {
      onAdd(
        facilityId,
        floorId,
        spaceId,
        {
          facets: asset.facets,
          images: asset.images,
          notes: asset.notes,
          type: asset.type,
          assetType: asset.assetType,
          projectId: project ? project.id : undefined,
          siteId: facility ? facility.siteId : undefined,
        },
        allRecords,
      )
    })

    dispatch({
      type: 'user/SET_STATE',
      payload: {
        assetCopy: {
          ...assetCopy,
          completed: true,
          copyAssets: [],
        },
      },
    })
    setTimeout(() => {
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          assetCopy: {
            completed: false,
            copyAssets: [],
          },
        },
      })
    }, 5000)
  }

  makeDetailedCopyAssets = copyAssets =>
    copyAssets.map(asset => ({
      ...asset,
      facets: asset.facets && {
        ...asset.facets,
        condition:
          typeof asset.facets.condition === 'string'
            ? asset.facets.condition
            : asset.facets.condition && asset.facets.condition.code,
      },
    }))

  render() {
    const {
      viewMode,
      filterKeys,
      isEditing,
      selectedAssetDetail,
      selectedItem,
      highlighted,
      sortOption,
      isVirtual,
    } = this.state

    const {
      treeData,
      user,
      spaceName,
      isVAInSpace,
      readOnly,
      readOnlyReason,
      history,
      contentAreaNavigation,
      allRecords: { assets: allAssets },
      allRecords,
    } = this.props
    const {
      assetCopy: { copyAssets, completed },
    } = user
    if (completed && !copyAssets.length) {
      history.push(
        makeSurveyUrl(
          contentAreaNavigation.project,
          contentAreaNavigation.facility,
          contentAreaNavigation.floor,
          contentAreaNavigation.space,
        ),
      )
    }
    const detailedCopyAssets = this.makeDetailedCopyAssets(copyAssets)
    const newAssets = resetAssets(treeData, detailedCopyAssets, isVAInSpace)
    const filterKeyGroup = filterKeysGrouping(filterKeys)
    const filteredAssets = filterData(newAssets, filterKeyGroup, allRecords)
    let filteredAssetTypeTreeData = [
      {
        children: filterAssetTypeTreeData(treeData, copyAssets),
        key: 'asset-type',
        selectable: false,
        title: 'Asset type',
        value: 'asset-type',
      },
    ]

    filteredAssetTypeTreeData = filteredAssetTypeTreeData.concat(
      getAdditionalAssetFilter(copyAssets, allRecords),
    )

    if (isVAInSpace) {
      filteredAssetTypeTreeData.push(getAssetClasses(filteredAssetTypeTreeData[0].children))
    }
    let coreExist = false
    filteredAssets.forEach(asset => {
      if (asset.facets.barcode) {
        coreExist = true
      }
    })

    const newColumns = columns.map(column => {
      if (isVAInSpace && column.dataIndex === 'type') {
        return {
          ...column,
          render: assetType => (
            <span>
              <span className={styles.marginRight5}>
                {assetType.virtual ? <Icon type="bulb" /> : <Icon type="wallet" />}
              </span>
              {assetType.value}
            </span>
          ),
        }
      }
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })
    if (!coreExist) {
      // In VAInSpace level, if we only have virtual assets, Manufacturer and Asset Id fields shouldn't be shown.
      newColumns.splice(1, 2)
    }

    return (
      <div>
        <RouteLeavingGuard
          when={copyAssets.length !== 0}
          navigate={path => {
            history.push(path)
          }}
          shouldBlockNavigation={() => {
            if (copyAssets.length !== 0) {
              return true
            }
            return false
          }}
          totalAssets={copyAssets.length}
          spaceName={spaceName}
        />
        <Helmet title="Copy assets" />
        {this.renderWarningCards({
          showPSQWarning: true,
          showDataSyncWarning: true,
        })}
        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: 'Complete copy',
              dataTestSelector: 'complete_copy',
              showFilterByBtn: true,
              treeData: filteredAssetTypeTreeData,
              isCopyAssets: true,
              onAdd: this.addCopyAssets,
              showInstallDateRangePicker: true,
            })}
            <AssetListing
              viewMode={viewMode}
              columns={newColumns}
              sortOption={sortOption}
              onChangeSortBy={this.onChangeSortBy}
              headerCurrent="Copy assets to"
              headerParent={spaceName}
              filteredAssets={filteredAssets}
              treeData={treeData}
              isVirtual={isVirtual}
              onEdit={this.onEdit}
              onPressItem={this.onEdit}
              onUpdate={this.onUpdate}
              onDelete={this.onDelete}
              onMenu={this.onMenu}
              highlighted={highlighted}
              tenant={user.tenant ? user.tenant : {}}
              readOnly={readOnly}
              isVAInSpace={isVAInSpace}
              isCopyAssets
            />
          </div>
        </section>
        {isVirtual ? (
          <EditVirtualAssetDrawer
            visible={isEditing}
            assetDetail={selectedAssetDetail}
            item={selectedItem}
            onClose={this.onCloseEditing}
            onConfirm={this.onUpdate}
            tenant={user.tenant ? user.tenant : {}}
            disabled={readOnly}
            readOnlyReason={readOnlyReason}
          />
        ) : (
          <EditAssetDrawer
            visible={isEditing}
            assetDetail={selectedAssetDetail}
            item={selectedItem}
            onClose={this.onCloseEditing}
            onConfirm={this.onUpdate}
            tenant={user.tenant ? user.tenant : {}}
            disabled={readOnly}
            readOnlyReason={readOnlyReason}
            allAssets={allAssets}
          />
        )}
        {this.renderFacilityPSQ()}
      </div>
    )
  }
}

export const CopyAssetsPage = Antd
export default connect(mapStateToProps)(Antd)
