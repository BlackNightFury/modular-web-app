import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import FloorForm from '@/components/EliasMwaComponents/DataCollection/Components/FloorForm'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './createFloorForm.pageobj'

export default class CreateFloorFormTestHelper {
  constructor() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)

    this.component = null
    this.submittedValues = null

    this.mockedProps = {
      handleSubmit: values => {
        this.submittedValues = values
      },
      initialValue: {},
      onClose: () => {},
    }
    this.mountWithProvider()
  }

  mountWithProvider() {
    this.component = mountWithProvider(<FloorForm {...this.mockedProps} />)
  }
}

const object = new CreateFloorFormTestHelper()
const pageObject = new PageObject(object)

When('I save a floor', () => {
  pageObject.createFloor()
})

Then('the created floor should be persisted', () => {
  pageObject.checkFloor()
})

Then('drawer should be closed', () => {
  pageObject.checkDrawerClosed()
})

When('I save a floor with a reminder note', () => {
  pageObject.createFloor({ withReminder: true })
})

Then('the created floor should be persisted with a reminder note', () => {
  pageObject.checkReminderNote()
})

When('I enter no data on floor form and click submit button', () => {
  object.mountWithProvider()
  pageObject.clickSubmitWithoutData()
})

Then('validation messages list for floor form should be shown at the bottom', () => {
  pageObject.checkValidationMessages()
})

Then('validation message should be available for each invalid field of floor form', () => {
  pageObject.checkValidationForEachField()
})
