import { Modal } from 'antd'
import React from 'react'
import { get } from 'lodash'
import { Helmet } from 'react-helmet'
import AssetsCardList from '@/components/EliasMwaComponents/DataCollection/Components/AssetsCardList'
import AssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/AssetsTable'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'
import EditAssetDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditAssetDrawer'
import CommonPage, { renderCollapseComponent } from '../CommonPage'
import {
  filterData,
  filterAssetTypeTreeData,
  findDetailsFromHierarchyTree,
  resetAssets,
  sort,
  getLevelsFromHierarchyTree,
} from '@/services/utils'
import { getViewMode, setViewMode } from '@/services/user'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'

import styles from './style.scss'

const columns = [
  {
    title: 'Name',
    dataIndex: 'type',
    key: 'type',
    editable: true,
    width: '30%',
    className: styles.firstColumn,
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: 'Install date',
    dataIndex: 'facets.install-date',
    key: 'installDate',
    editable: true,
    width: '5%',
    className: styles.hiddenSm,
    render: text => text && getBrowserLocaledDateTimeString(text),
    sorter: (a, b) =>
      get(a, 'facets.install-date', '').localeCompare(get(b, 'facets.install-date', '')),
  },
  {
    title: 'Condition',
    dataIndex: 'facets.condition.code',
    key: 'condition',
    editable: true,
    width: '5%',
    className: styles.hiddenMd,
    sorter: (a, b) =>
      get(a, 'facets.condition.code', '').localeCompare(get(b, 'facets.condition.code', '')),
  },
  {
    title: 'Qty',
    dataIndex: 'facets.quantity',
    key: 'quantity',
    editable: true,
    width: '5%',
    className: styles.hiddenXl,
    render: text => (
      <span data-test-selector="untaggedassets_qty">{text && text.toLocaleString()}</span>
    ),
    sorter: (a, b) => get(a, 'facets.quantity', 0) - get(b, 'facets.quantity', 0),
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    width: '35%',
    className: `${styles.locationStyle}`,
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => a.location && a.location.localeCompare(b.location),
  },
  {
    title: 'Last edited',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '5%',
    className: `${styles.rightAlign} ${styles.borderRightNone} ${styles.hiddenXs}`,
    render: text => text && getBrowserLocaledDateTimeString(text, true),
    sorter: (a, b) => a.createdAt && a.createdAt.localeCompare(b.createdAt),
  },
]

class Antd extends CommonPage {
  state = {
    type: '',
    filterKeys: [],
    selectedAssetDetail: {},
    selectedItem: {},
    isEditing: false,
    viewMode: getViewMode(),
    highlighted: null,
    sortOption: {
      isAscending: false,
      field: 'createdAt',
    },
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props
    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: {
        project: params.projectName,
        facility: params.facilityName,
      },
    })
  }

  onChangeSortBy = (field, isAscending) => {
    if (field && isAscending) {
      this.setState({ sortOption: { isAscending, field } })
    } else {
      const { sortOption } = this.state
      this.setState({
        sortOption: {
          isAscending: field ? isAscending : !sortOption.isAscending,
          field: field || sortOption.field,
        },
      })
    }
  }

  onChangeViewMode = viewMode => {
    setViewMode(viewMode)
    this.setState({ viewMode })
  }

  onCloseEditing = () => {
    this.setState({ isEditing: false })
  }

  onChange = key => {
    const { treeData } = this.props
    const facet = findDetailsFromHierarchyTree(key, treeData)
    this.setState({ type: key, selectedAssetDetail: facet })
  }

  onEdit = item => {
    const { 'install-date': installDate, quantity, condition, ...restItem } = item
    const { treeData } = this.props
    const facet = findDetailsFromHierarchyTree(item.type, treeData)

    this.setState({ selectedItem: restItem, selectedAssetDetail: facet, isEditing: true })
  }

  onMenu = (key, itemData) => {
    if (key === 'Delete') {
      this.onDelete(itemData)
    } else {
      this.onEdit(itemData)
    }
  }

  onDelete = itemData => {
    Modal.confirm({
      title: 'Are you sure delete this asset?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const { onDelete, allRecords } = this.props
        onDelete(itemData, allRecords)
        // qaHelper(itemData, allRecords, true)
      },
    })
  }

  onFilterKeysChanged = values => {
    this.setState({ filterKeys: values })
  }

  onSubmit = values => {
    const { selectedItem } = this.state
    const { facilityId, floorId, spaceId, projectId, siteId } = selectedItem
    const { onAdd, allRecords, treeData } = this.props

    const { type } = this.state
    const newType = type === '' ? selectedItem.type : type

    if (facilityId && floorId && spaceId) {
      const { id } = onAdd(
        facilityId,
        floorId,
        spaceId,
        {
          type: getLevelsFromHierarchyTree(newType, treeData),
          ...values,
          projectId,
          siteId,
        },
        allRecords,
      )
      this.setState({
        highlighted: id,
        type: '',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        this.setState({ highlighted: null })
      }, 3000)
    }
  }

  onUpdate = row => {
    const { onUpdate, allRecords } = this.props
    const { selectedItem } = this.state

    onUpdate({ ...selectedItem, ...row }, allRecords)

    this.setState({ isEditing: false })
  }

  render() {
    const {
      viewMode,
      filterKeys,
      isEditing,
      selectedAssetDetail,
      selectedItem,
      highlighted,
      sortOption,
    } = this.state

    const { treeData, assets, user, spaceName, readOnly } = this.props
    const newAssets = resetAssets(treeData, assets)
    const filteredAssets = filterData(newAssets, { type: filterKeys })
    const filteredAssetTypeTreeData = filterAssetTypeTreeData(treeData, assets)
    const sortedData = sort(filteredAssets, sortOption.field, sortOption.isAscending)

    const newColumns = columns.map(column => {
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
            onPressItem={this.onEdit}
            onChangeSortBy={this.onChangeSortBy}
            highlighted={highlighted}
          />
        ) : (
          <AssetsCardList
            data={sortedData}
            onDelete={this.onDelete}
            onEdit={this.onEdit}
            onMenu={this.onMenu}
            tenant={user.currentTenant}
            readOnly={readOnly}
          />
        )}
      </div>
    )

    return (
      <div>
        <Helmet title="Untagged Assets" />
        {this.renderWarningCards({
          showReadonlyWarning: true,
          showDataSyncWarning: true,
        })}
        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              dataTestSelector: 'add_space',
              showFilterByBtn: false,
              assetTypes: [],
              showInstallDateRangePicker: true,
            })}
            <div className={styles.filterWrapper}>
              <SearchableTree
                placeholder="Please select"
                searchPlaceholder="Search asset type..."
                treeData={filteredAssetTypeTreeData}
                onChange={this.onFilterKeysChanged}
                multiple
              />
            </div>
            {renderCollapseComponent({
              styles,
              key: 'assets',
              headerCurrent: 'Untagged Assets',
              headerParent: spaceName,
              numberOfResults: assets.length,
              tableContent,
            })}
          </div>
        </section>
        <EditAssetDrawer
          visible={isEditing}
          assetDetail={selectedAssetDetail}
          item={selectedItem}
          onClose={this.onCloseEditing}
          onConfirm={this.onUpdate}
          onSaveCopy={this.onSubmit}
          tenant={user.tenant ? user.tenant : {}}
          disabled={readOnly}
        />
        {this.renderFacilityPSQ()}
      </div>
    )
  }
}

export default Antd
