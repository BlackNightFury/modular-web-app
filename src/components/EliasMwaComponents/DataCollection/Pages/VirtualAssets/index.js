import { Modal, Button } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'dva'
import { get } from 'lodash'
import moment from 'moment'
import AssetsCardList from '@/components/EliasMwaComponents/DataCollection/Components/AssetsCardList'
import AssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/AssetsTable'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'
import LinkedAssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/LinkedAssetsTable'
import { getViewMode, hasRole } from '@/services/user'
import {
  filterData,
  isClickablePrototype,
  findDetailsFromHierarchyTree,
  sort,
  getLevelsFromHierarchyTree,
} from '@/services/utils'
import CommonPage, { renderCollapseComponent } from '../CommonPage'
import FormDrawerContainer from '../../Components/FormDrawerContainer'
import CreateVirtualAssetForm from '../../Components/CreateVirtualAssetForm'
import EditVirtualAssetDrawer from '../../Components/EditVirtualAssetDrawer'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import { getInstallDateFormat } from '@/services/asset-validation'

import styles from './style.scss'

const columns = [
  {
    title: 'Asset subtype',
    dataIndex: 'type',
    key: 'type',
    editable: true,
    width: '50%',
    className: styles.firstColumn,
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: 'Install date',
    dataIndex: 'facets.install-date',
    key: 'installDate',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenSm}`,
    render: text => text && getBrowserLocaledDateTimeString(text),
    sorter: (a, b) =>
      get(a, 'facets.install-date', '').localeCompare(get(b, 'facets.install-date', '')),
  },
  {
    title: 'Condition',
    dataIndex: 'facets.condition',
    key: 'condition',
    editable: true,
    width: '5%',
    className: styles.hiddenLg,
    sorter: (a, b) =>
      get(a, 'facets.condition.code', '').localeCompare(get(b, 'facets.condition.code', '')),
  },
  {
    title: 'Qty',
    dataIndex: 'facets.quantity',
    key: 'quantity',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXl}`,
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => get(a, 'facets.quantity', 0) - get(b, 'facets.quantity', 0),
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

const mapStateToProps = ({ completion }) => ({
  completion,
})

@connect(mapStateToProps)
class Antd extends CommonPage {
  state = {
    type: '',
    filterKeys: [],
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
    showPreSurvey: false,
    isQtyUpdatedInCardView: false,
  }

  previousDataSortedIds = []

  onUpdate = (row, isQtyUpdatedInCardView) => {
    const { onUpdate } = this.props
    const { selectedItem } = this.state
    const newValue = { ...selectedItem, ...row }
    onUpdate(newValue)
    this.setState({ isEditing: false })
    if (isQtyUpdatedInCardView) {
      this.setState({ isQtyUpdatedInCardView: true })
    } else {
      this.setState({ isQtyUpdatedInCardView: false })
    }
  }

  onChange = key => {
    const { treeData } = this.props
    const facet = findDetailsFromHierarchyTree(key, treeData)
    this.setState({ type: key, selectedAssetDetail: facet })
  }

  onEdit = item => {
    const { treeData } = this.props
    const facet = findDetailsFromHierarchyTree(item.type, treeData)

    const newFacets = { ...item.facets }
    if (newFacets['install-date']) {
      newFacets['install-date'] = getBrowserLocaledDateTimeString(newFacets['install-date'])
    }
    this.setState({
      selectedItem: { ...item, facets: newFacets },
      selectedAssetDetail: facet,
      isEditing: true,
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
    Modal.confirm({
      title: 'Are you sure delete this asset?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const { onDelete } = this.props
        onDelete(itemData)
      },
    })
  }

  onFilterKeysChanged = values => {
    this.setState({ filterKeys: values })
  }

  onSubmit = values => {
    const { assets, facilityId, floorId, onAdd, facility, project, onUpdate, treeData } = this.props
    const { type } = this.state

    if (facilityId && floorId) {
      let flag = false
      const filteredAssets = filterData(assets, { type: [type] })
      const valueFacets = values.facets

      filteredAssets.forEach(asset => {
        if (
          asset.condition === valueFacets.condition.code &&
          asset['install-date'] ===
            moment(valueFacets['install-date'], getInstallDateFormat())
              .toDate()
              .toISOString()
        ) {
          Modal.confirm({
            title: 'Same asset is already available. Do you want to update the quantity?',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk: () => {
              const updateAsset = asset
              const quantity = parseInt(asset.quantity, 10) + parseInt(valueFacets.quantity, 10)
              updateAsset.facets.quantity = quantity
              updateAsset.facets.condition = valueFacets.condition
              updateAsset.facets['install-date'] = valueFacets['install-date']
              onUpdate(updateAsset)
              this.setState({ drawerVisible: false, type: '' })
            },
          })
          flag = true
        }
      })
      if (!flag) {
        const { id } = onAdd(facilityId, floorId, {
          ...values,
          assetType: getLevelsFromHierarchyTree(type, treeData),
          projectId: project ? project.id : undefined,
          siteId: facility ? facility.siteId : undefined,
        })
        this.setState(
          {
            highlighted: id,
            type: '',
            isLinkedAssetsModal: isClickablePrototype(),
          },
          this.onClose,
        )
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => {
          this.setState({ highlighted: null })
        }, 3000)
      }
    }
  }

  closeDrawer = () => {
    this.setState({ type: '' }, this.onClose)
  }

  render() {
    const {
      viewMode,
      isLinkedAssetsModal,
      type,
      filterKeys,
      isEditing,
      selectedAssetDetail,
      createdItem,
      selectedItem,
      highlighted,
      drawerVisible,
      sortOption,
      isQtyUpdatedInCardView,
    } = this.state

    const {
      treeData,
      assets,
      user,
      subType2SysType,
      floorName,
      readOnly,
      isVAInSpace,
      readOnlyReason,
    } = this.props
    if (isVAInSpace) {
      return <div data-test-selector="VA_Error_Page">404 Error</div>
    }

    const filteredAssets = filterData(assets, { type: filterKeys }).map(obj => {
      obj['install-date'] = obj.facets['install-date']
      obj.quantity = obj.facets.quantity
      obj.condition = obj.facets.condition
      return obj
    })
    const { roles } = user
    let sortedData = []
    if (!isQtyUpdatedInCardView || sortOption.field !== 'createdAt') {
      sortedData = sort(filteredAssets, sortOption.field, sortOption.isAscending)
      this.previousDataSortedIds = []
      sortedData.forEach(data => this.previousDataSortedIds.push(data.id))
    } else {
      this.previousDataSortedIds.forEach(id => {
        const item = filteredAssets.find(asset => asset.id === id)
        if (item) {
          sortedData.push(item)
        }
      })
    }

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
            data={sortedData}
            onPressItem={this.onEdit}
            onUpdate={this.onUpdate}
            onDelete={this.onDelete}
            onChangeSortBy={this.onChangeSortBy}
            isVirtualAssets
            highlighted={highlighted}
            columns={newColumns}
            readOnly={readOnly}
          />
        ) : (
          <AssetsCardList
            subType2SysType={subType2SysType}
            data={sortedData}
            onDelete={this.onDelete}
            onEdit={this.onEdit}
            onMenu={this.onMenu}
            onUpdate={this.onUpdate}
            tenant={user.currentTenant}
            isVirtualAssets
            readOnly={readOnly}
            treeData={treeData}
          />
        )}
      </div>
    )

    return (
      <div>
        <Helmet title="Virtual assets" />
        {this.renderWarningCards({
          showReadonlyWarning: true,
          showDataSyncWarning: true,
        })}
        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: 'Add virtual asset',
              dataTestSelector: 'add_virtual_asset',
              showFilterByBtn: false,
              assetTypes: [],
              showInstallDateRangePicker: true,
            })}
            <div className={styles.filterWrapper}>
              <SearchableTree
                placeholder="Please select"
                searchPlaceholder="Search virtual asset type..."
                treeData={treeData}
                onChange={this.onFilterKeysChanged}
                multiple
              />
            </div>
            {renderCollapseComponent({
              styles,
              key: 'assets',
              headerCurrent: 'Virtual assets',
              headerParent: floorName,
              numberOfResults: assets.length,
              tableContent,
            })}
          </div>
        </section>
        <FormDrawerContainer onClose={this.closeDrawer} drawerVisible={drawerVisible}>
          <div className="drawerHeader">Add virtual asset</div>
          <div data-test-selector="addvirtualassetpanel">
            <div className={styles.darkGrey}>Select virtual asset type</div>
            <SearchableTree
              customStyle={{ fontSize: '12px' }}
              data-test-selector="virtualassetform_asset_type"
              placeholder="Please select"
              searchPlaceholder="Search virtual asset type..."
              treeData={treeData}
              onSelect={this.onChange}
              className={styles.assetTypes}
              value={type}
            />
          </div>
          {type !== '' && (
            <CreateVirtualAssetForm
              assetDetail={selectedAssetDetail}
              item={createdItem}
              tenant={user.tenant ? user.tenant : {}}
              handleSubmit={this.onSubmit}
              onClose={this.closeDrawer}
            />
          )}
          {type === '' && (
            <div className="text-center" data-test-selector="asset-form-cancel">
              <Button onClick={this.closeDrawer}>Cancel</Button>
            </div>
          )}
        </FormDrawerContainer>
        <FormDrawerContainer
          title="Add Linked Assets"
          onClose={() => this.setState({ isLinkedAssetsModal: false })}
          drawerVisible={isLinkedAssetsModal}
        >
          <LinkedAssetsTable data={[]} />
        </FormDrawerContainer>
        <EditVirtualAssetDrawer
          visible={isEditing}
          assetDetail={selectedAssetDetail}
          item={selectedItem}
          onClose={this.onCloseEditing}
          onConfirm={this.onUpdate}
          tenant={user.tenant ? user.tenant : {}}
          isEditDisabled={!hasRole(roles, 'admin')}
          disabled={readOnly}
          onShowPSQ={this.onShowPreSurveyor}
          readOnlyReason={readOnlyReason}
        />
        {this.renderFacilityPSQ()}
      </div>
    )
  }
}

export default Antd
