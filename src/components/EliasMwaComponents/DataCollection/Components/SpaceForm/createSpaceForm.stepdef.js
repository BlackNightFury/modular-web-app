import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import SpaceForm from '@/components/EliasMwaComponents/DataCollection/Components/SpaceForm'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './createSpaceForm.pageobj'

export default class CreateSpaceFormTestHelper {
  constructor() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)

    this.component = null
    this.submittedValues = null

    this.mockedProps = {
      handleSubmit: values => {
        this.submittedValues = values
      },
      spaceTypes: { '143': ['Accommodation', 'Attendants Hut', 'Balcony'] },
      projectId: '143',
      initialValue: {},
      onClose: () => {},
    }
    this.mountWithProvider()
  }

  mountWithProvider() {
    this.component = mountWithProvider(<SpaceForm {...this.mockedProps} />)
  }
}

const object = new CreateSpaceFormTestHelper()
const pageObject = new PageObject(object)

When('I save a space', () => {
  pageObject.createSpace()
})

Then('the created space should be persisted', () => {
  pageObject.checkSpace()
})

Then('create space drawer should be closed', () => {
  pageObject.checkDrawerClosed()
})

When('I save a space with a reminder note', () => {
  pageObject.createSpace({ withReminder: true })
})

Then('the created space should be persisted with a reminder note', () => {
  pageObject.checkReminderNote()
})

When('I enter no data on space form and click submit button', () => {
  object.mountWithProvider()
  pageObject.clickSubmitWithoutData()
})

Then('validation messages list for space form should be shown at the bottom', () => {
  pageObject.checkValidationMessages()
})

Then('validation message should be available for each invalid field of space form', () => {
  pageObject.checkValidationForEachField()
})

When('I click "create a space and add asset"', () => {
  pageObject.createSpaceAddAsset()
})

Then('the created space should be added to the table', () => {
  pageObject.checkSpaceAddAsset()
})
