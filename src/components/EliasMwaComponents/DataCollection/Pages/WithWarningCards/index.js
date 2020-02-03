import React from 'react'

import NewFacilityQuestionnaier from '../../Components/NewFacilityQuestionnaire'
import DataSyncWarningCard from '../../Components/WarningCard/DataSyncWarningCard'
import WarningCard from '../../Components/WarningCard'
import ReadonlyWarningCard from '../../Components/ReadonlyWarningCard'

const { forms } = window.mwa_config

class WithWarningCards extends React.Component {
  onShowPreSurveyor = () => {
    this.setState({
      showPreSurvey: true,
    })
  }

  onClosePreSurveyor = () => {
    this.setState({
      showPreSurvey: false,
    })
  }

  onSubmitPreSurveyor = values => {
    const { onAddPreSurveyorResponse, project, facility, user } = this.props
    if (onAddPreSurveyorResponse) {
      onAddPreSurveyorResponse({
        formId: project.preSurveyQuestionnaire,
        response: JSON.stringify({
          did_check_project_docs: values.did_check_project_docs,
          did_check_facility_docs: values.did_check_facility_docs,
          project_id: project.id,
          facility_id: facility.id,
          email: user.email,
        }),
      })
    }
    this.onClosePreSurveyor()
  }

  renderReadonlyWarningCard = () => {
    const { readOnly, readOnlyReason } = this.props

    return (
      <ReadonlyWarningCard
        readOnly={readOnly}
        readOnlyReason={readOnlyReason}
        onShowPSQ={this.onShowPreSurveyor}
      />
    )
  }

  renderDataSyncWarningCard = () => {
    const {
      user: {
        status: { indicator },
      },
    } = this.props

    return <DataSyncWarningCard indicator={indicator} />
  }

  renderFacilityPSQ = () => {
    const {
      facility,
      project: { preSurveyQuestionnaire },
      readOnly,
      readOnlyReason,
      project,
    } = this.props
    const { showPreSurvey } = this.state

    return (
      <NewFacilityQuestionnaier
        show={
          preSurveyQuestionnaire &&
          forms[preSurveyQuestionnaire] &&
          showPreSurvey &&
          readOnly &&
          readOnlyReason === 'PSQNotCompleted'
        }
        onClose={this.onClosePreSurveyor}
        onSubmit={this.onSubmitPreSurveyor}
        form={forms[preSurveyQuestionnaire]}
        project={project}
        facility={facility}
      />
    )
  }

  renderUnavailableWarningCard = () => (
    <WarningCard
      message="Warning"
      description="Please note ELIAS will be unavailable from November 10th 23:59 to November 11th 23:59 due to system maintenance"
      type="warning"
      showIcon
      show
    />
  )

  renderCompleteWarningCard = () => {
    const { completion, dispatch } = this.props

    if (!completion) {
      return <></>
    }

    const { completedDatasPendingForNotification } = completion

    return completedDatasPendingForNotification.map((data, index) => (
      <WarningCard
        key={index}
        message="Your completion was successful"
        description={
          <span>
            You successfully completed <b>{data.name}</b>, it has been updated and now shows a
            status of done.
          </span>
        }
        type="success"
        dataTestSelector="completion-warning-card"
        completedInfo={data}
        dispatch={dispatch}
        isComplete
        show
        showIcon
        closable
      />
    ))
  }

  renderCopyAssetsSuccessCard = () => {
    const { user, spaceName } = this.props
    if (user.assetCopy) {
      const {
        assetCopy: { completed, copyFrom },
      } = user

      return (
        <WarningCard
          message="Asset copy complete"
          description={
            <>
              Your assets have been successfully copied from {copyFrom} to {spaceName}, please add
              any additional assets as required.
            </>
          }
          type="success"
          showIcon
          show={completed}
        />
      )
    }
    return <></>
  }

  renderDeleteSpaceSuccessCard = deletedSpaceName => (
    <WarningCard message={`${deletedSpaceName} has been deleted`} type="success" showIcon show />
  )

  renderDeleteFloorSuccessCard = deletedFloorName => (
    <WarningCard message={`${deletedFloorName} has been deleted`} type="success" showIcon show />
  )

  renderWarningCards = options => {
    const {
      showDataSyncWarning,
      showReadonlyWarning,
      showUnavailableWarningCard,
      showDeleteSpaceSuccessCard,
      deletedSpaceName,
      showCopyAssetsSuccessCard,
      showDeleteFloorSuccessCard,
      deletedFloorName,
    } = options
    return (
      <>
        {this.renderCompleteWarningCard()}
        {showUnavailableWarningCard && this.renderUnavailableWarningCard()}
        {showReadonlyWarning && this.renderReadonlyWarningCard()}
        {showDataSyncWarning && this.renderDataSyncWarningCard()}
        {showDeleteSpaceSuccessCard && this.renderDeleteSpaceSuccessCard(deletedSpaceName)}
        {showCopyAssetsSuccessCard && this.renderCopyAssetsSuccessCard()}
        {showDeleteFloorSuccessCard && this.renderDeleteFloorSuccessCard(deletedFloorName)}
      </>
    )
  }
}

export default WithWarningCards
