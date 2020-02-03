import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import NewFacilityQuestionnaier from '@/components/EliasMwaComponents/DataCollection/Components/NewFacilityQuestionnaire'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import { basicPreSurvey } from '@/../testing/integration/__mock__/forms'
import PageObject from './newFacilityQuestionnaire.pageobj'

export default class NewFacilityQuestionnaierTestHelper {
  constructor() {
    this.component = null
    this.mockedProps = {
      onClose: () => {},
      onSubmit: () => {},
      show: true,
      form: basicPreSurvey,
      project: { preSurveyQuestionnaire: 'basic-pre-survey' },
      facility: {},
    }
  }

  mountWithIntl() {
    this.component = mountWithIntl(<NewFacilityQuestionnaier {...this.mockedProps} />)
  }

  update() {
    this.component.update()
  }
}

const object = new NewFacilityQuestionnaierTestHelper()
const pageObject = new PageObject(object)

Given('I am seeing pre survey questionnaire', () => {
  object.mountWithIntl()
})

Then('continue button should be disabled', () => {
  pageObject.checkContinueButtonStatus(true)
})

When('I complete the pre survey questionnaire', () => {
  pageObject.completePreSurveyQuestionnaire()
})

Then('continue button should be enabled', () => {
  object.update()
  pageObject.checkContinueButtonStatus(false)
})
