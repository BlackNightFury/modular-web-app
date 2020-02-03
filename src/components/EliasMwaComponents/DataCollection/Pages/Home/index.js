import React from 'react'
import { Helmet } from 'react-helmet'
import _ from 'lodash'
import { withRouter } from 'dva/router'
import { connect } from 'dva'
import FacilitiesTable from '@/components/EliasMwaComponents/DataCollection/Components/FacilitiesTable'
import MessageTable from '@/components/EliasMwaComponents/DataCollection/Components/MessageTable'
import Schedule from '@/components/EliasMwaComponents/DataCollection/Components/Schedule'
import FacilitiesCardList from '@/components/EliasMwaComponents/DataCollection/Components/FacilitiesCardList'
import KnownIssues from '@/components/EliasMwaComponents/DataCollection/Components/KnownIssues'
import {
  makeSurveyUrl,
  sort,
  isClickablePrototype,
  mappingStatusText,
  mappingStatusVisualIndicator,
  checkIfFacilityPSQCompleted,
  checkIfReadOnly,
  updateStorage,
  getConcatenatedUrl,
} from '@/services/utils'
import { getViewMode } from '@/services/user'
import CommonPage, { renderCollapseComponent } from '../CommonPage'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'
import NewFacilityQuestionnaier from '../../Components/NewFacilityQuestionnaire'
import EditFacilityDrawer from '../../Components/EditFacilityDrawer'

import styles from './style.scss'

const { forms, tenants, aws } = window.mwa_config

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    className: styles.firstColumn,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '5%',
    className: styles.hiddenSm,
    render: (text, row) => (
      <div>
        <div
          className={styles.visualStatusIndicator}
          data-test-selector="floortable_status_indicator"
          statusdata={text}
        >
          {row.isCompleted && mappingStatusVisualIndicator.DONE}
          {!row.isCompleted && text && mappingStatusVisualIndicator[text]}
        </div>
        <div className={styles.statusText}>
          {row.isCompleted && "I'm done"}
          {!row.isCompleted && text && mappingStatusText[text]}
          {row.completedAt && (
            <span className={styles.marginLeft10}>
              {getBrowserLocaledDateTimeString(row.completedAt, true)}
            </span>
          )}
        </div>
      </div>
    ),
    sorter: (a, b) => a.status.localeCompare(b.status),
  },
  {
    title: 'Site',
    dataIndex: 'siteId',
    key: 'siteId',
    width: '5%',
    className: styles.hiddenMd,
    sorter: (a, b) => a.project.localeCompare(b.project),
  },
  {
    title: 'Postcode',
    dataIndex: 'facets.postcode',
    key: 'postcode',
    width: '5%',
    className: styles.hiddenXl,
    sorter: (a, b) => a.facets.postcode.localeCompare(b.facets.postcode),
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
    title: 'Last edited',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '5%',
    className: `${styles.rightAlign} ${styles.borderRightNone} ${styles.hiddenXs}`,
    render: text => text && getBrowserLocaledDateTimeString(text, true),
    sorter: (a, b) => a.createdAt && a.createdAt.localeCompare(b.createdAt),
  },
]

const mapStateToProps = ({ contentAreaNavigation, user, completion }) => ({
  contentAreaNavigation,
  user,
  completion,
})
@withRouter
@connect(mapStateToProps)
class Antd extends CommonPage {
  state = {
    viewMode: getViewMode(),
    sortOption: {
      isAscending: false,
      field: 'createdAt',
    },
    selectedFacility: null,
    selectedFacilityPSQCompletion: false,
    isEditingFacility: false,
    showPSQ: false,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: { project: '', facility: '', floor: '', space: '' },
    })
  }

  getSelectedProject = facility => {
    const { projects } = this.props
    let selectedProject
    if (facility) {
      selectedProject = projects.find(item => item.name === facility.project)
    }

    return selectedProject
  }

  onGoFacility = itemData => {
    const { history, dispatch } = this.props
    const tenant = tenants[itemData.tenantId]
    if (!tenant) {
      return
    }

    const project = this.getSelectedProject(itemData) || {}
    updateStorage(tenant, aws.project_region)
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        currentTenantId: itemData.tenantId,
        currentTenant: tenant,
      },
    })
    history.push(
      makeSurveyUrl(
        getConcatenatedUrl(project.code, project.name),
        getConcatenatedUrl(itemData.code, itemData.name),
      ),
    )
  }

  onCloseFacilityEditing = () => {
    this.setState({ isEditingFacility: false })
  }

  onShowPSQ = () => {
    this.setState({ showPSQ: true, isEditingFacility: false })
  }

  onClosePSQ = () => {
    this.setState({ showPSQ: false })
  }

  onEditFacility = facility => {
    const {
      user: { facilityPSQCompleted },
    } = this.props
    let psq
    const selectedProject = this.getSelectedProject(facility)
    if (selectedProject) {
      psq = selectedProject.preSurveyQuestionnaire
    }

    const tenant = tenants[facility.tenantId]
    if (!tenant) {
      return
    }

    updateStorage(tenant, aws.project_region)

    this.setState({
      isEditingFacility: true,
      selectedFacility: facility,
      selectedFacilityPSQCompletion: checkIfFacilityPSQCompleted(
        psq,
        facility.originId,
        facilityPSQCompleted,
      ),
    })
  }

  onCompleteFacility = facility => {
    const { history, dispatch } = this.props
    const { name, code } = facility

    const tenant = tenants[facility.tenantId]
    if (!tenant) {
      return
    }

    updateStorage(tenant, aws.project_region)

    dispatch({
      type: 'user/SET_STATE',
      payload: {
        currentTenantId: facility.tenantId,
        currentTenant: tenant,
      },
    })
    const project = this.getSelectedProject(facility) || {}
    history.push(
      `${makeSurveyUrl(
        getConcatenatedUrl(project.code, project.name),
        getConcatenatedUrl(code, name),
      )}/completion`,
    )
  }

  onFacilityUpdate = values => {
    const { onUpdate } = this.props
    const { selectedFacility } = this.state
    const updatedFacility = { ...selectedFacility }
    _.keys(values).forEach(key => {
      _.set(updatedFacility, key, values[key])
    })
    onUpdate(updatedFacility)
    this.setState({ isEditingFacility: false, selectedFacility: null })
  }

  onSubmitPSQ = values => {
    const { selectedFacility } = this.state
    const { onAddPreSurveyorResponse, user } = this.props
    const project = this.getSelectedProject(selectedFacility)
    onAddPreSurveyorResponse(
      {
        formId: project.preSurveyQuestionnaire,
        response: JSON.stringify({
          did_check_project_docs: values.did_check_project_docs,
          did_check_facility_docs: values.did_check_facility_docs,
          project_id: project.id,
          facility_id: selectedFacility.originId,
          email: user.email,
        }),
        tenantId: selectedFacility.tenantId,
      },
      selectedFacility.originId,
    )

    this.onClosePSQ()
  }

  render() {
    const {
      viewMode,
      sortOption,
      isEditingFacility,
      selectedFacility,
      selectedFacilityPSQCompletion,
      showPSQ,
    } = this.state
    const { facilities } = this.props
    console.log(facilities, sortOption)
    const sortedData = sort(facilities, sortOption.field, sortOption.isAscending)
    const newColumns = columns.map(column => {
      if (column.dataIndex === sortOption.field) {
        return { ...column, sortOrder: sortOption.isAscending ? 'ascend' : 'descend' }
      }
      return column
    })

    const selectedProject = this.getSelectedProject(selectedFacility)

    const readOnlyFromProject = selectedProject && selectedProject.readonly

    const { readOnly, readOnlyReason } = checkIfReadOnly(
      readOnlyFromProject,
      selectedFacilityPSQCompletion,
      selectedFacility && selectedFacility.isCompleted,
    )

    const tableContent = (
      <div className={styles.facilitiesContainer}>
        {viewMode ? (
          <FacilitiesTable
            data={sortedData}
            columns={newColumns}
            onChangeSortBy={this.onChangeSortBy}
            onEditFacility={this.onEditFacility}
            onPressItem={this.onEditFacility}
            OnGoToFacility={this.onGoFacility}
            onCompleteFacility={this.onCompleteFacility}
          />
        ) : (
          <FacilitiesCardList
            data={sortedData}
            onPrimaryAction={this.onGoFacility}
            onEditFacility={this.onEditFacility}
            onPressItem={this.onEditFacility}
            OnGoToFacility={this.onGoFacility}
            onCompleteFacility={this.onCompleteFacility}
          />
        )}
      </div>
    )

    return (
      <div>
        <Helmet title="Home" />

        {this.renderWarningCards({
          showUnavailableWarningCard: isClickablePrototype(),
          showDataSyncWarning: true,
        })}

        <section className="card">
          <div className="card-body">
            {this.renderCardHeader({
              columns,
              styles,
              addBtnTitle: null,
              dataTestSelector: '',
              showFilterByBtn: false,
              assetTypes: [],
            })}
            {renderCollapseComponent({
              styles,
              key: 'facilities',
              headerCurrent: 'Facilities',
              headerParent: undefined,
              numberOfResults: facilities.length,
              tableContent,
            })}
          </div>
        </section>
        <section className="card">
          <div className="card-body">
            <KnownIssues />
          </div>
        </section>

        {isClickablePrototype() && (
          <>
            <section className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>My messages</strong>
                </div>
              </div>
              <div className="card-body">
                <MessageTable data={[]} />
              </div>
            </section>
            <section className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>My schedule</strong>
                </div>
              </div>
              <div className="card-body">
                <Schedule data={[]} />
              </div>
            </section>
          </>
        )}

        <EditFacilityDrawer
          onClose={this.onCloseFacilityEditing}
          visible={isEditingFacility}
          facility={selectedFacility}
          onUpdate={this.onFacilityUpdate}
          readOnly={readOnly}
          readOnlyReason={
            selectedFacility && selectedFacility.isCompleted ? 'FacilityCompleted' : readOnlyReason
          }
          onShowPSQ={this.onShowPSQ}
        />
        {selectedProject && selectedFacility && (
          <NewFacilityQuestionnaier
            show={
              selectedProject.preSurveyQuestionnaire &&
              forms[selectedProject.preSurveyQuestionnaire] &&
              showPSQ
            }
            onClose={this.onClosePSQ}
            onSubmit={this.onSubmitPSQ}
            form={forms[selectedProject.preSurveyQuestionnaire]}
            project={selectedProject}
            facility={selectedFacility}
          />
        )}
      </div>
    )
  }
}

export default Antd
