import { When, Then, Given } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import FormBuilder from '@/components/EliasMwaComponents/DataCollection/Components/Form'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './Form.pageobj'

export default class FormBuilderTestHelper {
  constructor() {
    this.component = null
  }

  mockSchemaWithRequiredFields() {
    this.mockedProps = {
      formInfo: {
        Description: [
          {
            type: 'ComboBox',
            name: 'Condition',
            key: 'condition',
            enum: ['A', 'B'],
            order: '1',
            validation: {
              mandatory: true,
            },
          },
        ],
      },
      initialValues: {},
      validate: () => ({
        Description: {
          condition: { __errors: ['Please input the Condition!'] },
        },
      }),
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<FormBuilder {...this.mockedProps} />)
  }
}

const object = new FormBuilderTestHelper()
const pageObject = new PageObject(object)

Given('form schema with required fields provided', () => {
  object.mockSchemaWithRequiredFields()
})

When('form is rendered and I click submit button', () => {
  object.mountWithProvider()
  pageObject.simulateValidation()
})

Then('validation messages list should be shown at the bottom', () => {
  pageObject.checkValidationMessagesList()
})

Then('validation message should be available for each invalid field of formbuilder', () => {
  pageObject.checkValidationForEachField()
})
