import React from 'react'
import { Row, Col, Checkbox } from 'antd'
import _ from 'lodash'
import { withApollo } from 'react-apollo'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { getIssues, getQAErrors, getQAWarnings } from '@/services/qa'
import KnownIssues from '@/components/EliasMwaComponents/DataCollection/Components/KnownIssues'
import FormBuilder from '@/components/EliasMwaComponents/Forms/Components/FormBuilder'
import {
  flattenToObject,
  checkIfFacilityPSQCompleted,
  isClickablePrototype,
} from '@/services/utils'
import { renderIcon } from '@/components/EliasMwaComponents/Navigation/Menu/MenuLeft/Modules/Common'
import { mergeForms } from '@/services/form-builder'
import WithWarningCards from '../WithWarningCards'
import WarningCard from '../../Components/WarningCard'
import CommonColors from '@/assets/colors'

import styles from './style.scss'

const { forms } = window.mwa_config
const siteMergedForm = mergeForms(forms['complete-facility'], forms['complete-site'])
class Antd extends WithWarningCards {
  state = {
    completeBtnDisabled: true,
    showSurvey: false,
    hasUnsyncedData: false,
    confirmed: false,
    formValues: {},
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props
    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: { project: params.projectName, facility: params.facilityName, floor: '', space: '' },
    })

    this.redirectToHome()

    const { client: awsAppSyncClient } = this.props
    this.unSubscriber = awsAppSyncClient.cache.store.subscribe(this.appsyncStoreChanged)
    this.appsyncStoreChanged()
  }

  componentDidUpdate(prevProps) {
    const { isCompleted } = this.props
    if (isCompleted && isCompleted !== prevProps.isCompleted) {
      this.redirectToHome()
    }
  }

  redirectToHome = () => {
    const { history, isCompleted } = this.props

    if (isCompleted) {
      history.push('/')
    }
  }

  componentWillUnmount() {
    if (this.unSubscriber) {
      this.unSubscriber()
    }
  }

  appsyncStoreChanged = () => {
    const { client: awsAppSyncClient } = this.props
    const appsyncStore = awsAppSyncClient.cache.store.getState()
    const {
      'appsync-metadata': {
        snapshot: { enqueuedMutations },
      },
      offline: { online, busy },
    } = appsyncStore

    this.setState({
      hasUnsyncedData: !online || (!busy && !!enqueuedMutations),
    })
  }

  onSave = () => {
    const { formValues } = this.state
    const { isLastFacility } = this.props
    const form = isLastFacility ? siteMergedForm : forms['complete-facility']

    const values = {
      ...flattenToObject(formValues),
      ..._.reduce(
        form.fieldsets || [],
        (result, fieldSet) => ({
          ...result,
          ..._.filter(fieldSet.questions || [], question => !question.visible).reduce(
            (prev, cur) => ({
              ...prev,
              [cur.fieldName]: cur.defaultValue,
            }),
            {},
          ),
        }),
        {},
      ),
    }

    this.completeFacility(values, true)
  }

  onComplete = values => {
    const { hasUnsyncedData } = this.state

    this.completeFacility(values, hasUnsyncedData)
  }

  completeFacility = (values, isSave) => {
    const {
      onAddCompletion,
      facility,
      history,
      savedFacilityCompletion,
      savedSiteCompletion,
      onUpdateCompletion,
      isLastFacility,
      site,
    } = this.props
    const facilityQuestions = _.reduce(
      forms['complete-facility'].fieldsets,
      (result, fieldSet) => {
        fieldSet.questions
          .map(question => question.fieldName)
          .forEach(question => result.push(question))
        return result
      },
      [],
    )
    const siteQuestions = _.reduce(
      forms['complete-site'].fieldsets,
      (result, fieldSet) => {
        fieldSet.questions
          .map(question => question.fieldName)
          .forEach(question => result.push(question))
        return result
      },
      [],
    )
    const facilityValues = _.reduce(
      facilityQuestions,
      (result, question) => {
        result[question] = values[question]
        return result
      },
      {},
    )
    const siteValues = _.reduce(
      siteQuestions,
      (result, question) => {
        result[question] = values[question]
        return result
      },
      {},
    )
    if (!isClickablePrototype()) {
      if (savedFacilityCompletion) {
        onUpdateCompletion(
          {
            ...savedFacilityCompletion,
            formId: 'complete-facility',
            response: JSON.stringify({
              ...facilityValues,
              type: 'facility-completion',
              facilityId: facility.id,
              status: isSave ? 'inProgress' : 'Complete',
            }),
          },
          facility.name,
        )

        if (isLastFacility) {
          onUpdateCompletion(
            {
              ...savedSiteCompletion,
              formId: 'complete-site',
              response: JSON.stringify({
                ...siteValues,
                type: 'site-completion',
                siteId: facility.siteId,
                status: isSave ? 'inProgress' : 'Complete',
              }),
            },
            site.name,
          )
        }
      } else {
        onAddCompletion(
          {
            formId: 'complete-facility',
            response: JSON.stringify({
              ...facilityValues,
              type: 'facility-completion',
              facilityId: facility.id,
              status: isSave ? 'inProgress' : 'Complete',
            }),
          },
          facility.name,
        )
        if (isLastFacility) {
          onAddCompletion(
            {
              formId: 'complete-site',
              response: JSON.stringify({
                ...siteValues,
                type: 'site-completion',
                siteId: facility.siteId,
                status: isSave ? 'inProgress' : 'Complete',
              }),
            },
            site.name,
          )
        }
      }
    }

    if (!isSave) {
      history.push('/')
    }
  }

  checkCompleteBtnStatus = formValues => {
    const { isLastFacility } = this.props
    const form = isLastFacility ? siteMergedForm : forms['complete-facility']
    const questionFields = form.fieldsets.reduce((result, curFieldSet) => {
      const { questions } = curFieldSet

      _.forEach(questions || [], question => {
        result.push({
          fieldName: question.fieldName,
          type: question.type,
        })
      })

      return result
    }, [])

    const flattenValues = flattenToObject(formValues)

    const isDisable = questionFields.some(field => {
      const { type, fieldName } = field
      if (type === 'CheckBox') {
        return false
      }
      return !flattenValues[fieldName]
    })

    this.setState({ formValues, completeBtnDisabled: isDisable })
  }

  onChangeAnswers = values => {
    this.checkCompleteBtnStatus(values)
  }

  onConfirmedChanged = e => {
    this.setState({
      confirmed: e.target.checked,
    })
  }

  render() {
    const { completeBtnDisabled, hasUnsyncedData, confirmed } = this.state
    const {
      allRecords,
      project: { preSurveyQuestionnaire },
      facility,
      user: { facilityPSQCompleted },
      savedFacilityCompletion,
      isLastFacility,
      numberOfFloorsInFacility,
      numberOfSpacesInFacility,
      numberOfAssetsInFacility,
      numberOfVAInFacility,
    } = this.props
    const assets = allRecords.assets.filter(asset => !asset.assetType.virtual)
    const virtualAssets = allRecords.assets.filter(asset => asset.assetType.virtual)
    const qaIssues = getIssues()
    const isFacilityPSQCompleted = checkIfFacilityPSQCompleted(
      preSurveyQuestionnaire,
      facility.id,
      facilityPSQCompleted,
    )

    const form = isLastFacility ? siteMergedForm : forms['complete-facility']
    return (
      <div>
        <Helmet title="Completion" />
        {this.renderWarningCards({
          showReadonlyWarning: true,
          showDataSyncWarning: true,
        })}
        <section className="card">
          <div className="card-body">
            <Row>
              <Col span={12}>
                <div>
                  <h5>
                    <strong>Summary of my work in {facility.name}</strong>
                  </h5>
                  <br />
                  <p>
                    {numberOfFloorsInFacility} of {allRecords.floors.length} Floors
                  </p>
                  <p>
                    {numberOfSpacesInFacility} of {allRecords.spaces.length} Spaces
                  </p>
                  <p>
                    {numberOfAssetsInFacility} of {assets.length} Assets
                  </p>
                  <p>
                    {numberOfVAInFacility} of {virtualAssets.length} Virtual Assets
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <h5>
                    <strong>Facility QA status</strong>
                  </h5>
                  <br />
                  <p>QA {qaIssues.length > 0 ? 'not ' : ''}passed</p>
                  <div data-test-selector="errors_count_contextpanel">
                    <span className={`${styles.smallIconContainer} ${styles.slateGrey}`}>
                      {renderIcon('empty-circle', CommonColors['error-pink'], '50%')}
                    </span>
                    <span className={`${styles.smallIconAfterText} ${styles.slateGrey}`}>
                      {getQAErrors().length} errors
                    </span>
                  </div>
                  <div data-test-selector="warnings_count_contextpanel">
                    <span className={`${styles.smallIconContainer} ${styles.slateGrey}`}>
                      {renderIcon('empty-circle', CommonColors['warning-amber'], '50%')}
                    </span>
                    <span className={`${styles.smallIconAfterText} ${styles.slateGrey}`}>
                      {getQAWarnings().length} warnings
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        <section className="card">
          <div className="card-body">
            <KnownIssues facilityId={facility && facility.id} />
          </div>
        </section>
        <section className="card">
          <div className="card-body">
            <FormBuilder
              initialValues={savedFacilityCompletion ? savedFacilityCompletion.response : {}}
              form={form}
              disabled={!isFacilityPSQCompleted}
              submitBtnText={hasUnsyncedData ? 'Save progress' : 'Complete'}
              submitDisabled={completeBtnDisabled || !confirmed}
              onChange={this.onChangeAnswers}
              onSubmit={this.onComplete}
              onSave={this.onSave}
              submitTestSelector="complete-facility-btn"
              saveTestSelector="save-complete-facility-btn"
              warningCard={
                hasUnsyncedData ? (
                  <WarningCard
                    className={styles.warningCard}
                    message="Data connection issue"
                    description="You do not have a connection, your local data is not upto date. Untill your data is synced you will not be able to complete your site survey."
                    type="warning"
                    showIcon
                    show
                  />
                ) : (
                  <WarningCard
                    className={styles.warningCard}
                    message={`You are about to complete your involvement in ${facility.name}`}
                    description={
                      <>
                        <div>
                          Please ensure you provide accurate information and enough detail to assist
                          any follow up of issues at a later date.
                          <br />
                          <b>
                            You will not be able to edit {facility.name}, its floors, spaces or
                            assets once completed this facility, so ensure you are actually complete
                            before submitting the form.
                          </b>
                        </div>
                        <Checkbox
                          className={styles.completionConfirm}
                          checked={confirmed}
                          onChange={this.onConfirmedChanged}
                          data-test-selector="data_will_not_editable_confirm"
                        >
                          I understand that on completion of {facility.name} the data will not be
                          editable.
                        </Checkbox>
                      </>
                    }
                    type="warning"
                    showIcon
                    show
                  />
                )
              }
              hideCancel
              hasUnsyncWarning
            />
            {this.renderFacilityPSQ()}
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = ({ completion }) => ({ completion })
export default connect(mapStateToProps)(withApollo(Antd))
