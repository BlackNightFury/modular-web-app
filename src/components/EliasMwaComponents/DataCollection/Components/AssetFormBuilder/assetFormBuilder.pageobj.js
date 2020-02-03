import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import AssetFormBuilder from '@/components/EliasMwaComponents/DataCollection/Components/AssetFormBuilder'

export default class AssetFormBuilderTestHelper {
  constructor() {
    this.component = null
    this.onValidateTriggered = false
    this.mockedProps = {
      schema: {
        Description: [
          {
            key: 'condition',
            label: 'Condition',
            enum: ['A', 'B', 'C', 'CX', 'D', 'DX'],
            options: [
              {
                code: 'A',
                description: 'A',
                legacyId: 2233,
              },
              {
                code: 'B',
                description: 'B',
                legacyId: 2234,
              },
              {
                code: 'C',
                description: 'C',
                legacyId: 2235,
              },
              {
                code: 'CX',
                description: 'CX',
                legacyId: 2236,
              },
              {
                code: 'D',
                description: 'D',
                legacyId: 2237,
              },
              {
                code: 'DX',
                description: 'DX',
                legacyId: 2238,
              },
            ],
            type: 'ComboBox',
            group: 'Description',
          },
        ],
        Others: [
          {
            key: 'install-date',
            label: 'Install Date',
            type: 'ComboBoxYear',
            group: 'Others',
          },
        ],
      },
      item: {
        condition: 'B',
        'install-date': '05/08/2019',
      },
      assetDetail: {
        lifecycle: 5,
      },
      validate: () => {
        this.onValidateTriggered = true
        return []
      },
      handleSubmit: () => {},
    }
  }

  mount = () => {
    this.component = mountWithProvider(<AssetFormBuilder {...this.mockedProps} />)
  }

  setCondition = index => {
    this.component
      .find('[data-test-selector="ant_select_box"]')
      .first()
      .simulate('click')
    this.component
      .find('ul')
      .childAt(index)
      .simulate('click')
  }

  submit = () => {
    this.component
      .find('[data-test-selector="assetformbuilder_form"]')
      .last()
      .simulate('submit')
  }

  checkPhotoError = isShow => {
    if (isShow) {
      expect(
        this.component.find('[data-test-selector="photo_validation_message"]').state().errorMessage,
      ).to.eql('You should take at least one photo.')
    } else {
      expect(
        this.component.find('[data-test-selector="photo_validation_message"]').state().errorMessage,
      ).to.eql('')
    }
  }

  checkImageRestricted = () => {
    this.component
      .find('[data-test-selector="image_restricted_checkbox"]')
      .last()
      .simulate('change', { target: { checked: true } })
  }

  checkImageNoteError = isShow => {
    if (isShow) {
      expect(
        this.component.find('[data-test-selector="image_note_validation_message"]').state()
          .errorMessage,
      ).to.eql('Please input the Image note!')
    } else {
      expect(
        this.component.find('[data-test-selector="image_note_validation_message"]').state()
          .errorMessage,
      ).to.eql('')
    }
  }

  fillImageNote = () => {
    this.component
      .find('[data-test-selector="image_note_input"]')
      .last()
      .simulate('change', { target: { value: 'No Image' } })
  }
}
