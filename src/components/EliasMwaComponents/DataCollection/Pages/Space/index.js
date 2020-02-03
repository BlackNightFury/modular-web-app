import { Modal, Button, Icon, Menu } from 'antd'
import React from 'react'
import { connect } from 'dva'
import { get } from 'lodash'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'
import LinkedAssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/LinkedAssetsTable'
import EditAssetDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditAssetDrawer'
import EditVirtualAssetDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditVirtualAssetDrawer'
import CreateAssetForm from '@/components/EliasMwaComponents/DataCollection/Components/CreateAssetForm'
import CreateVirtualAssetForm from '@/components/EliasMwaComponents/DataCollection/Components/CreateVirtualAssetForm'
import {
  isClickablePrototype,
  findDetailsFromHierarchyTree,
  flattenToArray,
  resetAssets,
  filterKeysGrouping,
  filterData,
  filterAssetTypeTreeData,
  getAssetClasses,
  getLevelsFromHierarchyTree,
  getAdditionalAssetFilter,
  makeSentenceCase,
  makeSurveyUrl,
  getConcatenatedUrl,
} from '@/services/utils'
import { getViewMode, hasRole } from '@/services/user'
import defaultAssetDetailsGenerator from '@/services/sample-data'
import FormDrawerContainer from '../../Components/FormDrawerContainer'
import CommonPage from '../CommonPage'
import AssetListing from '@/components/EliasMwaComponents/DataCollection/Components/AssetListing'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import { getInstallDateFormat } from '@/services/asset-validation'
import EditSpaceDrawer from '../../Components/EditSpaceDrawer'

import styles from './style.scss'
import DeleteSpaceWarningModal from '../../Components/DeleteSpaceWarningModal'

const { tenants } = window.mwa_config

export const columns = [
  {
    title: 'Name',
    dataIndex: 'type',
    key: 'type',
    editable: true,
    width: '30%',
    className: styles.firstColumn,
    render: text => (
      <div data-test-selector={`assetstable_name_${text}`}>{text && makeSentenceCase(text)}</div>
    ),
    sorter: (a, b) => get(a, 'type.value', '').localeCompare(get(b, 'type.value', '')),
  },
  {
    title: 'Manufacturer',
    dataIndex: 'facets.manufacturer',
    key: 'manufacturer',
    editable: true,
    width: '5%',
    className: styles.hiddenSm,
    render: text => <div data-test-selector="assetstable_manufacturer">{text}</div>,
    sorter: (a, b) =>
      get(a, 'facets.manufacturer', '').localeCompare(get(b, 'facets.manufacturer', '')),
  },
  {
    title: 'Asset ID',
    dataIndex: 'facets.barcode',
    key: 'barcode',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenMd}`,
    render: text => <div data-test-selector="assetstable_barcode">{text}</div>,
    sorter: (a, b) => get(a, 'facets.barcode', '').localeCompare(get(b, 'facets.barcode', '')),
  },
  {
    title: 'Install date',
    dataIndex: 'facets.install-date',
    key: 'installDate',
    editable: true,
    width: '5%',
    render: text => (
      <div data-test-selector="assetstable_install_date">
        {text && getBrowserLocaledDateTimeString(text)}
      </div>
    ),
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
    render: text => <div data-test-selector="assetstable_condition">{text}</div>,
    className: styles.hiddenXl,
    sorter: (a, b) => get(a, 'facets.condition', '').localeCompare(get(b, 'facets.condition', '')),
  },
  {
    title: 'Qty',
    dataIndex: 'facets.quantity',
    key: 'quantity',
    editable: true,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXxl}`,
    render: text => (
      <div data-test-selector="assetstable_quantity">{text && text.toLocaleString()}</div>
    ),
    sorter: (a, b) => a.facets.quantity - b.facets.quantity,
  },
  {
    title: 'Last edited',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '5%',
    className: `${styles.rightAlign} ${styles.borderRightNone} ${styles.hiddenXs}`,
    render: text => text && getBrowserLocaledDateTimeString(text, true),
    sorter: (a, b) => get(a, 'createdAt', '').localeCompare(get(b, 'createdAt')),
  },
]

const mapStateToProps = ({ contentAreaNavigation, settings, completion }) => ({
  contentAreaNavigation,
  isMobileView: settings.isMobileView,
  completion,
})

@connect(mapStateToProps)
class Antd extends CommonPage {
  intervalID = null

  state = {
    type: '',
    filterKeys: [],
    selectedAssetDetail: {},
    createdItem: {},
    selectedItem: {},
    isEditing: false,
    isCopy: false,
    viewMode: getViewMode(),
    highlighted: null,
    drawerVisible: false,
    sortOption: {
      isAscending: false,
      field: 'createdAt',
    },
    isVirtual: false,
    showPreSurvey: false,
    showFilter: true,
    isEditingSpace: false,
    deleteSpaceModalVisible: false,
  }

  componentDidMount() {
    if (this.props.location.action === 'openDrawer') {
      this.showDrawer()
    }
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

  componentWillUnmount() {
    if (this.intervalID) {
      clearTimeout(this.intervalID)
      this.intervalID = null
    }
  }

  onDeleteSpace = () => {
    this.setState({ deleteSpaceModalVisible: true })
  }

  handleCloseDeleteSpace = () => {
    this.setState({ deleteSpaceModalVisible: false })
  }

  onDeleteSpaceConfirm = () => {
    const {
      onDeleteSpace,
      space,
      match: { params },
      history,
    } = this.props
    onDeleteSpace(space)
    this.setState({ deleteSpaceModalVisible: false })
    history.push(makeSurveyUrl(params.projectName, params.facilityName, params.floorName))
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

  onChange = key => {
    const { treeData } = this.props
    const facet = findDetailsFromHierarchyTree(key, treeData)
    this.setState({
      type: key,
      selectedAssetDetail: facet,
      createdItem: {},
      isVirtual: facet.virtual,
    })
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

  onCopy = itemData => {
    this.setState({ isCopy: true })
    this.onEdit(itemData)
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
    const {
      assets,
      facilityId,
      floorId,
      space: { id: spaceId },
      onAdd,
      allRecords,
      facility,
      project,
      onUpdate,
      treeData,
    } = this.props
    const { type, selectedItem, isVirtual } = this.state

    let newType = type === '' ? selectedItem.type : type
    if (Object.prototype.hasOwnProperty.call(newType, 'virtual')) {
      newType = newType.value
    }

    if (facilityId && floorId && spaceId) {
      let flag = false
      if (isVirtual) {
        const filteredAssets = filterData(assets, { type: [type] })
        const valueFacets = values.facets
        filteredAssets.forEach(asset => {
          if (
            asset.facets.condition === valueFacets.condition.code &&
            asset.facets['install-date'] ===
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
                const quantity =
                  parseInt(asset.facets.quantity, 10) + parseInt(valueFacets.quantity, 10)
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
      }
      if (!flag) {
        const { id } = onAdd(
          facilityId,
          floorId,
          spaceId,
          {
            ...values,
            assetType: getLevelsFromHierarchyTree(newType, treeData),
            projectId: project ? project.id : undefined,
            siteId: facility ? facility.siteId : undefined,
          },
          allRecords,
        )
        this.setState(
          {
            highlighted: id,
            type: '',
            isLinkedAssetsModal: isClickablePrototype(),
          },
          this.onClose,
        )
        window.scrollTo({ top: 0, behavior: 'smooth' })
        this.intervalID = setTimeout(() => {
          this.setState({ highlighted: null })
        }, 3000)
      }
    }
    this.setState({ isEditing: false })
  }

  onUpdate = row => {
    const { onUpdate, allRecords, isVAInSpace, treeData } = this.props
    const { selectedItem, type } = this.state
    const updatedItem = { ...selectedItem, ...row }
    if (isVAInSpace) {
      let newType = type === undefined ? undefined : type.value
      if (newType === undefined) {
        newType = updatedItem.type.value
      }
      onUpdate(
        { ...updatedItem, assetType: getLevelsFromHierarchyTree(newType, treeData) },
        allRecords,
      )
    } else {
      onUpdate(updatedItem, allRecords)
    }

    this.setState({ isEditing: false })
  }

  closeDrawer = () => {
    this.setState({ type: '' }, this.onClose)
  }

  onFavorite = () => {
    const {
      user,
      dispatch,
      match: {
        params: { projectName, facilityName, floorName },
      },
      space,
    } = this.props
    let { favSpaces } = user
    const isInFavSpaces = favSpaces.find(item => item.asset.id === space.id)
    if (isInFavSpaces) {
      favSpaces = favSpaces.filter(item => item.asset.id !== space.id)
    } else {
      favSpaces = [
        ...favSpaces,
        {
          asset: space,
          url: makeSurveyUrl(
            projectName,
            facilityName,
            floorName,
            getConcatenatedUrl(space.id, space.name),
          ),
        },
      ]
    }

    dispatch({
      type: 'user/SET_STATE',
      payload: { favSpaces },
    })
  }

  onShowEditingSpace = () => {
    this.setState({
      isEditingSpace: true,
    })
  }

  onCloseEditingSpace = () => {
    this.setState({
      isEditingSpace: false,
    })
  }

  onUpdateSpace = row => {
    const {
      onUpdateSpace,
      match: {
        params: { projectName, facilityName, floorName },
      },
      history,
    } = this.props
    onUpdateSpace(row)
    this.onCloseEditingSpace()
    history.push(
      makeSurveyUrl(projectName, facilityName, floorName, getConcatenatedUrl(row.id, row.name)),
    )
  }

  secondaryActionHandler = ({ key, domEvent }) => {
    domEvent.stopPropagation()

    if (key === 'favorite') {
      this.onFavorite()
    } else if (key === 'edit') {
      this.onShowEditingSpace()
    } else if (key === 'delete') {
      this.onDeleteSpace()
    }
  }

  renderSecondaryAction = () => {
    const {
      user: { favSpaces },
      space: { id: spaceId },
    } = this.props
    return (
      <Menu onClick={this.secondaryActionHandler}>
        <Menu.Item key="favorite" data-test-selector="favorite_button">
          {favSpaces.find(space => space.asset.id === spaceId) ? 'Unfavorite' : 'Favorite'}
        </Menu.Item>
        <Menu.Item key="edit" data-test-selector="edit_button">
          Edit
        </Menu.Item>
        <Menu.Item key="delete" data-test-selector="delete_button">
          Delete
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const {
      viewMode,
      isLinkedAssetsModal,
      type,
      filterKeys,
      isEditing,
      isCopy,
      createdItem,
      selectedAssetDetail,
      selectedItem,
      highlighted,
      drawerVisible,
      sortOption,
      isVirtual,
      isEditingSpace,
      deleteSpaceModalVisible,
    } = this.state
    const {
      treeData,
      assets,
      user,
      space,
      space: { name: spaceName },
      isVAInSpace,
      readOnly,
      readOnlyReason,
      spaceTypes,
      allRecords,
      allRecords: { assets: allAssets },
    } = this.props
    const { roles, tenantId } = user
    const newAssets = resetAssets(treeData, assets, isVAInSpace)
    const filterKeyGroup = filterKeysGrouping(filterKeys)
    const filteredAssets = filterData(newAssets, filterKeyGroup, allRecords)
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
      getAdditionalAssetFilter(assets, allRecords),
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
          ...(sortOption.field === 'type'
            ? { sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
            : {}),
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
        <Helmet title="Assets" />
        {this.renderWarningCards({
          showReadonlyWarning: true,
          showDataSyncWarning: true,
          showCopyAssetsSuccessCard: true,
        })}
        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: 'Add Asset',
              dataTestSelector: 'add_asset',
              showFilterByBtn: true,
              treeData: filteredAssetTypeTreeData,
              hasSecondaryAction: true,
              secondaryActions: this.renderSecondaryAction(),
              secondaryActionDropdownSelector: 'space-page-secondary-dropdown',
              showInstallDateRangePicker: true,
            })}
            <AssetListing
              viewMode={viewMode}
              columns={newColumns}
              sortOption={sortOption}
              onChangeSortBy={this.onChangeSortBy}
              headerCurrent="Assets"
              headerParent={spaceName}
              filteredAssets={filteredAssets}
              treeData={treeData}
              isVirtual={isVirtual}
              onEdit={this.onEdit}
              onPressItem={this.onEdit}
              onUpdate={this.onUpdate}
              onCopy={this.onCopy}
              onDelete={this.onDelete}
              onMenu={this.onMenu}
              highlighted={highlighted}
              tenant={user.tenant ? user.tenant : {}}
              readOnly={readOnly}
              isVAInSpace={isVAInSpace}
            />
          </div>
        </section>
        <FormDrawerContainer onClose={this.closeDrawer} drawerVisible={drawerVisible}>
          <div className="drawerHeader">Add asset</div>
          <div data-test-selector="addassetpanel">
            <div className={styles.darkGrey}>Select asset type</div>
            <SearchableTree
              customStyle={{ fontSize: '12px' }}
              data-test-selector="assetform_asset_type"
              placeholder="Please select"
              searchPlaceholder="Search asset type..."
              treeData={treeData}
              onSelect={this.onChange}
              className={styles.assetTypes}
              value={type}
            />
          </div>
          {type !== '' &&
            (isVirtual ? (
              <CreateVirtualAssetForm
                assetDetail={selectedAssetDetail}
                item={createdItem}
                tenant={user.tenant ? user.tenant : {}}
                handleSubmit={this.onSubmit}
                onClose={this.closeDrawer}
              />
            ) : (
              <CreateAssetForm
                assetDetail={selectedAssetDetail}
                item={createdItem}
                tenant={user.tenant ? user.tenant : {}}
                handleSubmit={this.onSubmit}
                setInitialData={this.setInitialData}
                hasDummyData={user.tenant.dummyDataEnable || false}
                onClose={this.closeDrawer}
                allAssets={allAssets}
              />
            ))}
          {type === '' && (
            <div className="text-center">
              <Button onClick={this.closeDrawer} data-test-selector="asset-form-cancel">
                Cancel
              </Button>
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
        {isVirtual ? (
          <EditVirtualAssetDrawer
            visible={isEditing}
            assetDetail={selectedAssetDetail}
            item={selectedItem}
            onClose={this.onCloseEditing}
            onConfirm={this.onUpdate}
            tenant={user.tenant ? user.tenant : {}}
            isEditDisabled={isVirtual && !hasRole(roles, 'admin')}
            disabled={readOnly}
            readOnlyReason={readOnlyReason}
            onShowPSQ={this.onShowPreSurveyor}
          />
        ) : (
          <EditAssetDrawer
            visible={isEditing}
            assetDetail={selectedAssetDetail}
            item={selectedItem}
            isCopy={isCopy}
            onClose={this.onCloseEditing}
            onConfirm={this.onUpdate}
            onSaveCopy={this.onSubmit}
            tenant={user.tenant ? user.tenant : {}}
            disabled={readOnly}
            readOnlyReason={readOnlyReason}
            onShowPSQ={this.onShowPreSurveyor}
            allAssets={allAssets}
          />
        )}
        {deleteSpaceModalVisible && (
          <DeleteSpaceWarningModal
            onConfirm={this.onDeleteSpaceConfirm}
            onCancel={this.handleCloseDeleteSpace}
            assets={assets}
          />
        )}
        {this.renderFacilityPSQ()}
        <EditSpaceDrawer
          visible={isEditingSpace}
          item={space}
          spaceTypes={spaceTypes}
          onClose={this.onCloseEditingSpace}
          onConfirm={this.onUpdateSpace}
          readOnly={readOnly}
          onShowPSQ={this.onShowPreSurveyor}
          readOnlyReason={readOnlyReason}
          projectId={(tenants[tenantId] || {}).legacy_project_id}
        />
      </div>
    )
  }
}

export default Antd
