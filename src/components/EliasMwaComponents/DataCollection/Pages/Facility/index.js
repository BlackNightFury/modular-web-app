import React from 'react'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { Row, Col, Table, Menu } from 'antd'
import _ from 'lodash'
import FloorsTable from '@/components/EliasMwaComponents/DataCollection/Components/FloorsTable'
import EditFloorDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditFloorDrawer'
import ConditionSurveyFacilityForm from '@/components/EliasMwaComponents/DataCollection/Components/ConditionSurveyFacilityForm'
import FloorsCardList from '@/components/EliasMwaComponents/DataCollection/Components/FloorsCardList'
import CommonPage, { renderCollapseComponent, renderConditionSurveyEl } from '../CommonPage'
import { getViewMode, setViewMode } from '@/services/user'
import {
  filterData,
  makeURL,
  sort,
  checkIfFacilityPSQCompleted,
  mappingStatusText,
  mappingStatusVisualIndicator,
  getConcatenatedUrl,
  makeSurveyUrl,
} from '@/services/utils'
import FormDrawerContainer from '../../Components/FormDrawerContainer'
import CompleteFloorDrawer from '../../Components/CompleteFloorDrawer'
import EditSpaceDrawer from '../../Components/EditSpaceDrawer'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import CreateFloorDrawer from '../../Components/CreateFloorDrawer'
import EditFacilityDrawer from '../../Components/EditFacilityDrawer'
import DeleteFloorWarningModal from '@/components/EliasMwaComponents/DataCollection/Components/DeleteFloorWarningModal'

import styles from './style.scss'

const { facilityConditionSurveyHierarchy } = window.mwa_config

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    className: styles.firstColumn,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, row) => <div data-test-selector={`floorstable_name_${row.name}`}>{text}</div>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '5%',
    className: styles.hiddenSm,
    render: (text, row) => {
      let indicatorText = text
      if (
        text === 'DONE' &&
        row.subSpaces &&
        row.subSpaces.find(subSpace => subSpace.status === 'INACCESSIBLE')
      ) {
        indicatorText = 'INACCESSIBLE'
      }
      return (
        <div>
          <div className={styles.visualStatusIndicator}>
            {text && mappingStatusVisualIndicator[indicatorText]}
          </div>
          <div className={styles.statusText}>
            {text && mappingStatusText[text]}
            {row.completedAt && (
              <span className={styles.marginLeft10}>
                {getBrowserLocaledDateTimeString(row.completedAt, true)}
              </span>
            )}
          </div>
        </div>
      )
    },
    sorter: (a, b) => a.status.localeCompare(b.status),
  },
  {
    title: 'Spaces',
    dataIndex: 'spaces',
    key: 'spaces',
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenMd}`,
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => a.spaces - b.spaces,
  },
  {
    title: 'Assets',
    dataIndex: 'assets',
    key: 'assets',
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => a.assets - b.assets,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXl}`,
  },
  {
    title: 'V assets',
    dataIndex: 'virtualAssets',
    key: 'virtualAssets',
    render: text => text && text.toLocaleString(),
    sorter: (a, b) => a.virtualAssets - b.virtualAssets,
    width: '5%',
    className: `${styles.rightAlign} ${styles.hiddenXl}`,
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

const conditionSurveyColumns = [
  {
    title: '',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
    render: (text, row) => {
      const statusText = row.showStatus && 'NOT_STARTED'
      return (
        <div>
          <div className={styles.visualStatusIndicator}>
            {statusText && mappingStatusVisualIndicator[statusText]}
          </div>
          {text}
        </div>
      )
    },
  },
  {
    title: 'GIA',
    dataIndex: 'GIA',
    key: 'GIA',
    sorter: (a, b) => a.GIA.localeCompare(b.GIA),
    render: text => text && `${text}%`,
  },
  {
    title: 'priority',
    dataIndex: 'priority',
    key: 'priority',
    sorter: (a, b) => a.priority.localeCompare(b.priority),
  },
  {
    title: 'key',
    dataIndex: 'key',
    key: 'key',
    sorter: (a, b) => a.key.localeCompare(b.key),
  },
  {
    title: 'condition',
    dataIndex: 'condition',
    key: 'condition',
    sorter: (a, b) => a.condition.localeCompare(b.condition),
  },
  {
    title: 'actions',
    dataIndex: 'actions',
    key: 'actions',
    sorter: (a, b) => a.condition.localeCompare(b.condition),
    render: () => <span className={styles.multiActionButton}>...</span>,
  },
]

const mapStateToProps = ({ contentAreaNavigation, user, completion }) => ({
  contentAreaNavigation,
  user,
  completion,
})

@connect(mapStateToProps)
class Antd extends CommonPage {
  state = {
    statusFilter: [],
    selectedItem: {},
    selectedSpace: {},
    isEditing: false,
    isCompleteFloor: false,
    selectedCompleteFloor: null,
    viewMode: getViewMode(),
    highlighted: null,
    drawerVisible: false,
    conditionSurveyDrawerVisible: false,
    conditionSurveyDrawerItem: '1.0',
    sortOption: {
      isAscending: false,
      field: 'createdAt',
    },
    showPreSurvey: false,
    collapseOpenStatus: {},
    showEditFacilityDrawer: false,
    showFilter: true,
    deleteFloorModalVisible: false,
    isFloorDeleted: false,
    deleteItem: {},
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
      project: { preSurveyQuestionnaire },
      facility,
      user: { facilityPSQCompleted },
    } = this.props
    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: { project: params.projectName, facility: params.facilityName, floor: '', space: '' },
    })

    if (!checkIfFacilityPSQCompleted(preSurveyQuestionnaire, facility.id, facilityPSQCompleted)) {
      this.setState({
        showPreSurvey: true,
      })
    }
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

  handleSubmit = values => {
    const { facility, onAdd } = this.props
    if (facility.id) {
      const { id } = onAdd(facility.id, values)
      this.setState({ highlighted: id })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        this.setState({ highlighted: null })
      }, 3000)
    }
  }

  onStatusFilterChanged = values => {
    this.setState({ statusFilter: values })
  }

  onGoFloor = itemData => {
    const { history } = this.props
    history.push(
      makeURL(
        `${history.location.pathname}/floors/${getConcatenatedUrl(itemData.id, itemData.name)}`,
      ),
    )
  }

  onSecondaryAction = (key, item) => {
    if (key === 'complete') {
      this.onShowCompleteFloor(item)
    }
    if (key === 'delete') {
      this.setState({ deleteFloorModalVisible: true, deleteItem: item })
    }
  }

  onDeleteConfirm = () => {
    const { onDelete } = this.props
    const { deleteItem } = this.state
    const { id } = onDelete(deleteItem)
    if (id) {
      this.setState({ isFloorDeleted: true })
      setTimeout(() => {
        this.setState({ isFloorDeleted: false, deleteItem: null })
      }, 5000)
    }
    this.setState({ deleteFloorModalVisible: false })
  }

  handleGoback = () => {
    this.setState({ deleteFloorModalVisible: false })
  }

  onShowCompleteFloor = item => {
    this.setState({ selectedCompleteFloor: item.id, isCompleteFloor: true })
  }

  onCloseCompleteFloor = () => {
    this.setState({ isCompleteFloor: false })
  }

  onCompleteFloorPressed = floor => {
    const { onUpdate } = this.props
    onUpdate(floor, true)
    this.setState({ selectedCompleteFloor: null })
  }

  onPressSpaceItem = item => {
    this.setState({ selectedSpace: item })
  }

  onCloseSpaceEditing = () => {
    this.setState({ selectedSpace: {} })
  }

  showConditionSurveyDrawer = conditionSurveyDrawerItem => {
    this.setState({ conditionSurveyDrawerVisible: true, conditionSurveyDrawerItem })
  }

  hideConditionSurveyDrawer = () => {
    this.setState({ conditionSurveyDrawerVisible: false })
  }

  onSpaceConfirm = row => {
    const { onUpdateSpace } = this.props
    onUpdateSpace(row)
    this.setState({ selectedSpace: {} })
  }

  onFloorConfirm = row => {
    if (row.status === 'DONE') {
      this.onShowCompleteFloor(row)
      return
    }
    this.onConfirm(row)
  }

  onSubmitCSurveyFacilityForm = values => {
    const { conditionSurveyDrawerItem, collapseOpenStatus } = this.state
    const { cSurveyData, onUpdateConditionSurveyData } = this.props

    const newCSurveyData = _.cloneDeep(cSurveyData)
    const cSurveyFacilityFormTreeData = newCSurveyData.find(
      item => item.key === conditionSurveyDrawerItem,
    )
    const checkAndAddInfo = treeData => {
      if (values.elementType.indexOf(treeData.key) !== -1) {
        treeData.showEl = true
      }
      if (values.elementType === treeData.key) {
        Object.assign(treeData, values)
      }
      if (treeData.children) {
        treeData.children.forEach(item => checkAndAddInfo(item))
      }
    }

    checkAndAddInfo(cSurveyFacilityFormTreeData)
    onUpdateConditionSurveyData(newCSurveyData)
    if (!collapseOpenStatus[conditionSurveyDrawerItem]) {
      this.setState({
        collapseOpenStatus: {
          ...collapseOpenStatus,
          [conditionSurveyDrawerItem]: true,
        },
      })
    }
  }

  onFacilityUpdate = values => {
    const { onUpdateFacility, facility } = this.props
    const updatedFacility = { ...facility }
    _.keys(values).forEach(key => {
      _.set(updatedFacility, key, values[key])
    })
    onUpdateFacility(updatedFacility)
    this.setState({ showEditFacilityDrawer: false })
  }

  onExpandChange(key) {
    const { collapseOpenStatus } = this.state
    this.setState({
      collapseOpenStatus: {
        ...collapseOpenStatus,
        [key]: !collapseOpenStatus[key],
      },
    })
  }

  openEditFacilityDrawer = () => {
    this.setState({
      showEditFacilityDrawer: true,
    })
  }

  closeEditFacilityDrawer = () => {
    this.setState({
      showEditFacilityDrawer: false,
    })
  }

  secondaryActionHandler = ({ key, domEvent }) => {
    const { history, contentAreaNavigation } = this.props

    domEvent.stopPropagation()
    if (key === 'edit-facility') {
      this.openEditFacilityDrawer()
    } else if (key === 'complete-facility') {
      history.push(
        `${makeSurveyUrl(
          contentAreaNavigation.project,
          contentAreaNavigation.facility,
        )}/completion`,
      )
    }
  }

  renderSecondaryAction = () => (
    <Menu onClick={this.secondaryActionHandler}>
      <Menu.Item key="edit-facility" data-test-selector="edit_facility_button">
        Edit Facility
      </Menu.Item>
      <Menu.Item key="complete-facility" data-test-selector="complete_facility_button">
        Complete Facility
      </Menu.Item>
    </Menu>
  )

  render() {
    const {
      match: { params },
      floors,
      facility,
      readOnlyReason,
      isVAInSpace,
      readOnly,
      mandatoryTypes,
      treeData,
      spaceTypes,
      showConditionSurvey,
      cSurveyData,
    } = this.props

    const {
      statusFilter,
      isEditing,
      selectedItem,
      selectedSpace,
      viewMode,
      highlighted,
      drawerVisible,
      conditionSurveyDrawerVisible,
      sortOption,
      isCompleteFloor,
      selectedCompleteFloor,
      conditionSurveyDrawerItem,
      collapseOpenStatus,
      showEditFacilityDrawer,
      deleteFloorModalVisible,
      isFloorDeleted,
      deleteItem,
    } = this.state
    const selectedCompleteItem = _.find(floors, { id: selectedCompleteFloor })

    const filteredFloors = filterData(floors, { status: statusFilter })

    const sortedData = sort(filteredFloors, sortOption.field, sortOption.isAscending)
    const newColumns = columns.map(column => {
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })

    const tableContent = (
      <div className={styles.floorsContainer}>
        {viewMode ? (
          <FloorsTable
            ref={table => {
              this.table = table
            }}
            data={sortedData}
            projectName={params.projectName}
            facilityName={params.facilityName}
            onPressItem={this.onPressItem}
            onChangeSortBy={this.onChangeSortBy}
            onSecondaryAction={this.onSecondaryAction}
            highlighted={highlighted}
            columns={newColumns}
            isVAInSpace={isVAInSpace}
          />
        ) : (
          <FloorsCardList
            data={sortedData}
            projectName={params.projectName}
            facilityName={params.facilityName}
            onPressItem={this.onPressItem}
            onSecondaryAction={this.onSecondaryAction}
            highlighted={highlighted}
            columns={newColumns}
            isVAInSpace={isVAInSpace}
          />
        )}
      </div>
    )

    const flattenConditionSurveyElements = data => {
      const { children, ...ownData } = data
      let flattenElements = []
      if (Array.isArray(data)) {
        data.forEach(el => {
          flattenElements = flattenElements.concat(flattenConditionSurveyElements(el))
        })
      } else {
        flattenElements = [ownData]
        if (children && children.length) {
          children.forEach(el => {
            flattenElements = flattenElements.concat(flattenConditionSurveyElements(el))
          })
        }
      }

      return flattenElements.filter(el => el.showEl)
    }
    const conditionSurveyElBody = data => {
      const flattenData = flattenConditionSurveyElements(data)

      return (
        <Table
          showHeader={false}
          rowKey="key"
          rowClassName={record => `group-level-${record.key.split('.').length}`}
          className="utils__scrollTable"
          scroll={{ x: '100%' }}
          columns={conditionSurveyColumns}
          dataSource={flattenData}
          pagination={false}
        />
      )
    }

    const cSurveyFacilityFormTreeData = (facilityConditionSurveyHierarchy || []).find(
      item => item.key === conditionSurveyDrawerItem,
    )

    return (
      <div>
        <Helmet title="Floors" />
        {this.renderWarningCards({
          showReadonlyWarning: true,
          showDataSyncWarning: true,
          showDeleteFloorSuccessCard: isFloorDeleted,
          deletedFloorName: deleteItem && deleteItem.name,
        })}
        <section className="card">
          {showConditionSurvey && cSurveyData && (
            <div className="card-header">
              <span className={styles.facilityDetailsLabel}>Facility details - </span>
              <span className={styles.facilityName}>{facility.name}</span>
            </div>
          )}
          <div className="card-body">
            {showConditionSurvey && cSurveyData && (
              <Row gutter={24} type="flex" className={styles.conditionSurveyContainer}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  {cSurveyData
                    .filter((item, idx) => !(idx % 2))
                    .map(item =>
                      renderConditionSurveyEl({
                        styles,
                        key: item.key,
                        expanded: collapseOpenStatus[item.key],
                        headerCurrent: `${item.title} - ${item.key}`,
                        tableContent: conditionSurveyElBody(item.children),
                        statusText: 'NOT_STARTED',
                        onAddNew: () => this.showConditionSurveyDrawer(item.key),
                        onExpandChange: () => this.onExpandChange(item.key),
                      }),
                    )}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  {cSurveyData
                    .filter((item, idx) => idx % 2)
                    .map(item =>
                      renderConditionSurveyEl({
                        styles,
                        key: item.key,
                        expanded: collapseOpenStatus[item.key],
                        headerCurrent: `${item.title} - ${item.key}`,
                        tableContent: conditionSurveyElBody(item.children),
                        statusText: 'NOT_STARTED',
                        onAddNew: () => this.showConditionSurveyDrawer(item.key),
                        onExpandChange: () => this.onExpandChange(item.key),
                      }),
                    )}
                </Col>
              </Row>
            )}
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: 'Add Floor',
              dataTestSelector: 'add_floor',
              showFilterByBtn: false,
              assetTypes: [],
              hasSecondaryAction: true,
              secondaryActions: this.renderSecondaryAction(),
              secondaryActionDropdownSelector: 'facility-page-secondary-dropdown',
              showStatusFilter: true,
              statusList: ['EX_DONE', 'NOT_STARTED', 'IN_PROGRESS', 'DONE'],
            })}
            {renderCollapseComponent({
              styles,
              key: 'floors',
              headerCurrent: 'Floors',
              headerParent: facility.name,
              numberOfResults: floors.length,
              tableContent,
            })}
          </div>
        </section>
        {showConditionSurvey && (
          <FormDrawerContainer
            onClose={this.hideConditionSurveyDrawer}
            drawerVisible={conditionSurveyDrawerVisible}
          >
            <div className={styles.drawerHeader}>Add element</div>
            {
              <ConditionSurveyFacilityForm
                treeData={cSurveyFacilityFormTreeData.children}
                handleSubmit={this.onSubmitCSurveyFacilityForm}
                onClose={this.hideConditionSurveyDrawer}
                initialValue={{}}
              />
            }
          </FormDrawerContainer>
        )}
        <CreateFloorDrawer
          onClose={this.onClose}
          drawerVisible={drawerVisible}
          handleSubmit={this.handleSubmit}
        />
        {this.renderFacilityPSQ()}
        <EditFacilityDrawer
          onClose={this.closeEditFacilityDrawer}
          visible={showEditFacilityDrawer}
          facility={facility}
          onUpdate={this.onFacilityUpdate}
          readOnly={readOnly}
          readOnlyReason={readOnlyReason}
          onShowPSQ={this.onShowPreSurveyor}
        />
        <EditFloorDrawer
          visible={isEditing}
          item={selectedItem}
          onClose={this.onCloseEditing}
          onConfirm={this.onFloorConfirm}
          readOnly={readOnly}
          onShowPSQ={this.onShowPreSurveyor}
          readOnlyReason={readOnlyReason}
        />
        <EditSpaceDrawer
          visible={!!Object.keys(selectedSpace).length}
          item={selectedSpace}
          spaceTypes={spaceTypes}
          onClose={this.onCloseSpaceEditing}
          onConfirm={this.onSpaceConfirm}
          readOnly={readOnly}
          onShowPSQ={this.onShowPreSurveyor}
          readOnlyReason={readOnlyReason}
        />
        <CompleteFloorDrawer
          visible={isCompleteFloor}
          item={selectedCompleteItem}
          mandatoryTypes={mandatoryTypes}
          treeData={treeData}
          onClose={this.onCloseCompleteFloor}
          onSelectSpace={this.onPressSpaceItem}
          onCompleteFloor={this.onCompleteFloorPressed}
        />
        {deleteFloorModalVisible && (
          <DeleteFloorWarningModal
            onConfirm={this.onDeleteConfirm}
            onCancel={this.handleGoback}
            spaces={deleteItem && deleteItem.spaces}
            assets={deleteItem && deleteItem.assets + deleteItem.virtualAssets}
          />
        )}
      </div>
    )
  }
}

export default Antd
