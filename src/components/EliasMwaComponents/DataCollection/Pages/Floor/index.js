import React from 'react'
import { connect } from 'dva'
import Link from 'umi/link'
import { Helmet } from 'react-helmet'
import { Tooltip, Menu, Modal } from 'antd'
import SpacesTable from '@/components/EliasMwaComponents/DataCollection/Components/SpacesTable'
import SpacesCardList from '@/components/EliasMwaComponents/DataCollection/Components/SpacesCardList'
import EditSpaceDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditSpaceDrawer'
import CommonPage, { renderCollapseComponent } from '../CommonPage'
import {
  filterData,
  makeURL,
  removeEmptyValues,
  sort,
  mappingStatusText,
  mappingStatusVisualIndicator,
  getConcatenatedUrl,
  makeSurveyUrl,
} from '@/services/utils'
import { getViewMode } from '@/services/user'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import CreateSpaceDrawer from '../../Components/CreateSpaceDrawer'
import DeleteSpaceWarningModal from '@/components/EliasMwaComponents/DataCollection/Components/DeleteSpaceWarningModal'
import CompleteFloorDrawer from '../../Components/CompleteFloorDrawer'
import EditFloorDrawer from '../../Components/EditFloorDrawer'

import styles from './style.scss'

const { tenants } = window.mwa_config
export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    className: styles.firstColumn,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, row) => {
      const localName = row.localName ? `, ${row.localName}` : ''
      const department = row.department ? `, ${row.department}` : ''
      return (
        <Tooltip placement="topLeft" title={`${text}${localName}${department}`}>
          <div data-test-selector={`spacestable_name_${row.name}`}>{text}</div>
        </Tooltip>
      )
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '5%',
    className: styles.hiddenSm,
    render: (text, row) => (
      <div>
        <div className={styles.visualStatusIndicator}>
          {text && mappingStatusVisualIndicator[text]}
        </div>
        <div className={styles.statusText}>
          {text && mappingStatusText[text]}
          {row.completedAt && (
            <span className={styles.marginLeft10}>
              {getBrowserLocaledDateTimeString(row.completedAt, true)}
            </span>
          )}
          {row.availableDate && (
            <span className={styles.marginLeft10}>
              {getBrowserLocaledDateTimeString(row.availableDate)}
            </span>
          )}
        </div>
      </div>
    ),
    sorter: (a, b) => a.status.localeCompare(b.status),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: '5%',
    className: styles.hiddenMd,
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: 'Assets',
    dataIndex: 'assets',
    key: 'assets',
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXl}`,
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => a.assets - b.assets,
  },
  {
    title: 'Local name',
    dataIndex: 'localName',
    key: 'localName',
    width: '5%',
    className: styles.hiddenXl,
    sorter: (a, b) => a.localName && a.localName.localeCompare(b.localName),
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: '5%',
    className: styles.hiddenXxl,
    sorter: (a, b) => a.department && a.department.localeCompare(b.department),
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

const mapStateToProps = ({ contentAreaNavigation, completion }) => ({
  contentAreaNavigation,
  completion,
})

@connect(mapStateToProps)
class Antd extends CommonPage {
  state = {
    statusFilter: [],
    selectedItem: {},
    isCompleteFloor: false,
    isEditing: false,
    isEditingFloor: false,
    viewMode: getViewMode(),
    highlighted: null,
    drawerVisible: false,
    sortOption: {
      isAscending: false,
      field: 'createdAt',
    },
    showPreSurvey: false,
    showFilter: true,
    deleteSpaceModalVisible: false,
    isSpaceDeleted: false,
    deleteItem: {},
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
        floor: params.floorName,
        space: '',
      },
    })
  }

  onShowEditFloor = () => {
    this.setState({
      isEditingFloor: true,
    })
  }

  onCloseEditingFloor = () => {
    this.setState({
      isEditingFloor: false,
    })
  }

  onUpdateFloor = floor => {
    const {
      onUpdateFloor,
      history,
      match: {
        params: { projectName, facilityName },
      },
    } = this.props

    onUpdateFloor(floor)

    this.onCloseEditingFloor()
    history.push(makeSurveyUrl(projectName, facilityName, getConcatenatedUrl(floor.id, floor.name)))
  }

  onFloorConfirm = row => {
    if (row.status === 'DONE') {
      this.onShowCompleteFloor(row)
      return
    }

    this.onUpdateFloor(row)
  }

  onShowCompleteFloor = () => {
    this.setState({ isCompleteFloor: true })
  }

  onCloseCompleteFloor = () => {
    this.setState({ isCompleteFloor: false })
  }

  onCompleteFloorPressed = floor => {
    const { onUpdateFloor } = this.props
    onUpdateFloor(floor, true)
    this.onCloseCompleteFloor()
  }

  handleSubmit = values => {
    const {
      facilityId,
      floor: { id: floorId },
      onAdd,
    } = this.props
    const newValues = removeEmptyValues(values)
    let newId
    if (facilityId && floorId) {
      const { id } = onAdd(facilityId, floorId, newValues)
      newId = id
      this.setState({ highlighted: id })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        this.setState({ highlighted: null })
      }, 3000)
    }
    return newId
  }

  onDelete = itemData => {
    this.setState({ deleteSpaceModalVisible: true, deleteItem: itemData })
  }

  onDeleteConfirm = () => {
    const { onDelete } = this.props
    const { deleteItem } = this.state
    const { id } = onDelete(deleteItem)
    if (id) {
      this.setState({ isSpaceDeleted: true })
      setTimeout(() => {
        this.setState({ isSpaceDeleted: false, deleteItem: null })
      }, 5000)
    }
    this.setState({ deleteSpaceModalVisible: false })
  }

  handleGoback = () => {
    this.setState({ deleteSpaceModalVisible: false })
  }

  onStatusFilterChanged = values => {
    this.setState({ statusFilter: values })
  }

  onGoSpace = itemData => {
    const { history } = this.props
    history.push(
      makeURL(
        `${history.location.pathname}/spaces/${getConcatenatedUrl(itemData.id, itemData.name)}`,
      ),
    )
  }

  secondaryActionHandler = ({ key, domEvent }) => {
    const {
      floor,
      match: { params },
      history,
    } = this.props
    domEvent.stopPropagation()

    if (key === 'complete') {
      this.onShowCompleteFloor()
    } else if (key === 'edit') {
      this.onShowEditFloor()
    } else if (key === 'delete') {
      Modal.confirm({
        title: 'Are you sure delete this floor?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          const { onDeleteFloor } = this.props
          onDeleteFloor(floor)
          history.push(makeSurveyUrl(params.projectName, params.facilityName))
        },
      })
    }
  }

  renderSecondaryAction = () => {
    const {
      isVAInSpace,
      match: { params },
      floor,
    } = this.props
    return (
      <Menu onClick={this.secondaryActionHandler}>
        {!isVAInSpace && (
          <Menu.Item key="virtual_assets" data-test-selector="virtual_assets_button">
            <Link
              to={`${makeSurveyUrl(
                params.projectName,
                params.facilityName,
                params.floorName,
              )}/virtual-assets`}
            >
              Virtual assets
            </Link>
          </Menu.Item>
        )}
        {floor.status !== 'DONE' && (
          <Menu.Item key="complete" data-test-selector="complete_button">
            Complete
          </Menu.Item>
        )}
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
      match: { params },
      spaces,
      spaceTypes,
      floor,
      floor: { name: floorName },
      readOnly,
      readOnlyReason,
      user: { currentTenantId: tenantId },
      mandatoryTypes,
      treeData,
    } = this.props
    const {
      statusFilter,
      isEditing,
      isEditingFloor,
      selectedItem,
      viewMode,
      highlighted,
      drawerVisible,
      sortOption,
      deleteSpaceModalVisible,
      isSpaceDeleted,
      deleteItem,
      isCompleteFloor,
    } = this.state

    const filteredSpaces = filterData(spaces, { status: statusFilter })

    const sortedData = sort(filteredSpaces, sortOption.field, sortOption.isAscending)
    const newColumns = columns.map(column => {
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })

    const tableContent = (
      <div className={styles.spacesContainer}>
        {viewMode ? (
          <SpacesTable
            data={sortedData}
            projectName={params.projectName}
            facilityName={params.facilityName}
            floorName={params.floorName}
            onPressItem={this.onPressItem}
            onDelete={this.onDelete}
            onChangeSortBy={this.onChangeSortBy}
            highlighted={highlighted}
            columns={newColumns}
          />
        ) : (
          <SpacesCardList
            data={sortedData}
            projectName={params.projectName}
            facilityName={params.facilityName}
            floorName={params.floorName}
            onPrimaryAction={this.onGoSpace}
            onDelete={this.onDelete}
          />
        )}
      </div>
    )

    return (
      <div>
        <Helmet title="Spaces" />
        {this.renderWarningCards({
          showReadonlyWarning: true,
          showDataSyncWarning: true,
          showDeleteSpaceSuccessCard: isSpaceDeleted,
          deletedSpaceName: deleteItem && deleteItem.name,
        })}
        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: 'Add Space',
              dataTestSelector: 'add_space',
              showFilterByBtn: false,
              assetTypes: [],
              showStatusFilter: true,
              statusList: ['EX_DONE', 'NOT_STARTED', 'INACCESSIBLE', 'IN_PROGRESS', 'DONE'],
              hasSecondaryAction: true,
              secondaryActions: this.renderSecondaryAction(),
              secondaryActionDropdownSelector: 'floor-page-secondary-dropdown',
            })}
            {renderCollapseComponent({
              styles,
              key: 'spaces',
              headerCurrent: 'Spaces',
              headerParent: floorName,
              numberOfResults: spaces.length,
              tableContent,
            })}
          </div>
        </section>
        <CreateSpaceDrawer
          onClose={this.onClose}
          drawerVisible={drawerVisible}
          handleSubmit={this.handleSubmit}
          spaceTypes={spaceTypes}
          projectId={(tenants[tenantId] || {}).legacy_project_id}
          projectName={params.projectName}
          facilityName={params.facilityName}
          floorName={params.floorName}
        />
        <EditSpaceDrawer
          visible={isEditing}
          item={selectedItem}
          spaceTypes={spaceTypes}
          onClose={this.onCloseEditing}
          onConfirm={this.onConfirm}
          readOnly={readOnly}
          onShowPSQ={this.onShowPreSurveyor}
          readOnlyReason={readOnlyReason}
          projectId={(tenants[tenantId] || {}).legacy_project_id}
        />
        {deleteSpaceModalVisible && (
          <DeleteSpaceWarningModal
            onConfirm={this.onDeleteConfirm}
            onCancel={this.handleGoback}
            assets={deleteItem && deleteItem.assets}
          />
        )}
        {this.renderFacilityPSQ()}
        <CompleteFloorDrawer
          visible={isCompleteFloor}
          item={floor}
          mandatoryTypes={mandatoryTypes}
          treeData={treeData}
          onClose={this.onCloseCompleteFloor}
          onSelectSpace={this.onPressItem}
          onCompleteFloor={this.onCompleteFloorPressed}
        />
        <EditFloorDrawer
          visible={isEditingFloor}
          item={floor}
          onClose={this.onCloseEditingFloor}
          onConfirm={this.onFloorConfirm}
          readOnly={readOnly}
          onShowPSQ={this.onShowPreSurveyor}
          readOnlyReason={readOnlyReason}
        />
      </div>
    )
  }
}

export default Antd
