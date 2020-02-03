import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import CreateAssetForm from '@/components/EliasMwaComponents/DataCollection/Components/CreateAssetForm'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import { assetDetail, item, tenant } from '@/../testing/integration/step_definitions/common/asset'
import PageObject from './createAssetForm.pageobj'

export default class CreateAssetFormTestHelper {
  constructor() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)

    this.component = null
    this.submittedValues = null
    this.mockedProps = {
      assetDetail,
      item: {},
      tenant,
      hasDummyData: true,
      allAssets: [
        {
          facets: {
            barcode: '111111111',
          },
        },
      ],
      handleSubmit: values => {
        this.submittedValues = values
      },
      setInitialData: () => {
        this.mockedProps.item = item
        this.component.setProps({
          children: <CreateAssetForm {...this.mockedProps} />,
        })
      },
      onClose: () => {},
    }
    this.mountWithProvider()
  }

  mountWithProvider() {
    this.component = mountWithProvider(<CreateAssetForm {...this.mockedProps} />)
  }

  mountWithLastBarcode() {
    const newInitialState = _.cloneDeep(initialState)
    newInitialState.user.lastBarcode = '318072191'
    global.store = mockStore(newInitialState)
    this.component = mountWithProvider(<CreateAssetForm {...this.mockedProps} />)
  }
}

const object = new CreateAssetFormTestHelper()
const pageObject = new PageObject(object)

When('I save an asset', () => {
  pageObject.createAsset()
})

Then('submitted values should be correct', () => {
  pageObject.checkSubmittedValue()
})

When('I save an asset with a reminder note', () => {
  pageObject.createAsset({ withReminder: true })
})

Then('the created asset should be persisted with a reminder note', () => {
  pageObject.checkReminderNotes()
})

Given("I've previously created an asset", () => {
  object.mountWithLastBarcode()
  pageObject.createAsset({ withReminder: true })
})

When('I increment the asset barcode', () => {
  pageObject.createAsset({ fromLastBarcode: true })
})

Then('next barcode number should be used', () => {
  pageObject.checkNextBarcode()
})

When('I save an asset with invalid data', () => {
  pageObject.createAsset({ wrongValueType: true })
})

Then('type validation message should appear', () => {
  pageObject.checkValidationMessage()
})

When('I save an asset with same barcode of existing one', () => {
  pageObject.createAsset({ duplicatedBarcode: true })
})

Then('duplicated barcode validation message should appear', () => {
  pageObject.checkValidationMessage({ duplicatedBarcode: true })
})
