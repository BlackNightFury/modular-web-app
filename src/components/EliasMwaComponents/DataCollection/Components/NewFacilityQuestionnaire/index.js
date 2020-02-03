import React from 'react'
import _ from 'lodash'
import FormDrawerContainer from '../FormDrawerContainer'
import FormBuilder from '@/components/EliasMwaComponents/Forms/Components/FormBuilder'
import { getDocLinkValues } from '@/services/form-builder'

class NewFacilityQuestionnaier extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      submitDisabled: true,
      initialValues: {},
    }
  }

  componentDidMount() {
    this.getPresurveyorInitialValues()
  }

  getPresurveyorForm = () => {
    const {
      project: { preSurveyQuestionnaire, name: projectName },
      facility: { name: facilityName },
      form,
    } = this.props

    if (!preSurveyQuestionnaire || !form) {
      return {}
    }
    const newForm = _.cloneDeep(form)

    // Project docs
    newForm.fieldsets[0].name = `${form.fieldsets[0].name}${projectName}`

    // Facility docs
    newForm.fieldsets[1].name = `${form.fieldsets[1].name}${facilityName}`

    return newForm
  }

  getPresurveyorInitialValues = () => {
    const {
      project: { preSurveyQuestionnaire, docs: projectDocs },
      facility: { docs: facilityDocs },
      form,
    } = this.props

    if (!preSurveyQuestionnaire || !form) {
      this.setState({
        initialValues: {},
      })
    }

    this.setState({
      initialValues: {
        project_docs: JSON.stringify(getDocLinkValues(projectDocs || [])),
        facility_docs: JSON.stringify(getDocLinkValues(facilityDocs || [])),
      },
    })
  }

  onChange = formData => {
    let submitDisabled = false
    let initialValues = {}
    _.keys(formData).forEach(key => {
      if (key.startsWith('Facility')) {
        submitDisabled = submitDisabled || formData[key].did_check_facility_docs !== 'checked'
      }

      if (key.startsWith('Project')) {
        submitDisabled = submitDisabled || formData[key].did_check_project_docs !== 'checked'
      }

      initialValues = {
        ...initialValues,
        ...formData[key],
      }
    })
    this.setState({
      submitDisabled,
      initialValues,
    })
  }

  validate = (formData, errors) => errors

  render() {
    const { show, onClose, form, onSubmit } = this.props
    const { submitDisabled, initialValues } = this.state
    return (
      <FormDrawerContainer
        title={form && form.header}
        onClose={onClose}
        drawerVisible={show}
        testSelector="new_facility_questionnaire"
      >
        <FormBuilder
          form={this.getPresurveyorForm()}
          initialValues={initialValues}
          onClose={onClose}
          onSubmit={onSubmit}
          submitBtnText="Continue"
          submitDisabled={submitDisabled}
          onChange={this.onChange}
          validate={this.validate}
          hideSave
        />
      </FormDrawerContainer>
    )
  }
}

export default NewFacilityQuestionnaier
