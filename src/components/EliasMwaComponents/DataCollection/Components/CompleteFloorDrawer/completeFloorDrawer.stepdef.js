import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import CompleteFloorDrawer from '@/components/EliasMwaComponents/DataCollection/Components/CompleteFloorDrawer'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './completeFloorDrawer.pageobj'

export default class CompleteFloorDrawerTestHelper {
  constructor() {
    this.component = null
    this.submittedFloor = null

    this.mockedProps = {
      treeData: [],
      mandatoryTypes: [],
      visible: true,
      item: null,
      onClose: () => {},
      onSelectSpace: () => {},
      onCompleteFloor: floor => {
        this.submittedFloor = floor
      },
    }
  }

  inaccessibleSpaceMock() {
    this.mockedProps.mandatoryTypes = []
    this.mockedProps.item = {
      notes: {},
      subSpaces: [
        {
          status: 'INACCESSIBLE',
          notes: {},
          availableDate: '2030-06-29T07:56:36.261Z',
        },
      ],
      subAssets: [],
    }
  }

  incompleteSpaceMock() {
    this.mockedProps.mandatoryTypes = []
    this.mockedProps.item = {
      notes: {},
      subSpaces: [
        {
          status: 'NOT_STARTED',
          notes: {},
        },
      ],
      subAssets: [],
    }
  }

  withoutMandatoryAssetsMock() {
    this.mockedProps.mandatoryTypes = [40456, 40453, 40454, 40455]
    this.mockedProps.item = {
      notes: {},
      subSpaces: [
        {
          status: 'NOT_STARTED',
          notes: {},
        },
      ],
      subAssets: [],
    }
  }

  completeSpaceAndMandatoryAssetsMock() {
    this.mockedProps.mandatoryTypes = [40456]
    this.mockedProps.item = {
      notes: {},
      subSpaces: [
        {
          status: 'DONE',
          notes: {},
        },
      ],
      subAssets: [
        {
          type: 'Amplifier-40456',
        },
      ],
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<CompleteFloorDrawer {...this.mockedProps} />)
  }
}
const object = new CompleteFloorDrawerTestHelper()
const pageObject = new PageObject(object)

Given('an inaccessible space is created', () => {
  object.inaccessibleSpaceMock()
})

Given('a floor is created with an incomplete space', () => {
  object.incompleteSpaceMock()
})

Given('a floor is created without mandatory assets', () => {
  object.withoutMandatoryAssetsMock()
})

Given('a complete space is created and mandatory assets are present', () => {
  object.completeSpaceAndMandatoryAssetsMock()
})

When('I complete the floor', () => {
  object.mountWithProvider()
})

When('I accept the checkbox and submit', () => {
  pageObject.acceptCheckbox()
  pageObject.submitForm()
})

When('I accept the warnings and submit', () => {
  pageObject.acceptCheckbox()
  pageObject.submitForm()
})

Then('I should be prompted with not done spaces warning', () => {
  pageObject.spaceWarningAvailable(true)
})

Then('I should be prompted with inaccessible warning', () => {
  pageObject.inaccessibleWarningAvailable(true)
})

Then('I should be prompted with compulsory assets warning', () => {
  pageObject.compulsoryAssetsWarningAvailable(true)
})

Then('I should be prompted with a warning', () => {
  pageObject.warningAvailable(true)
})

Then('I should not be prompted with a warning', () => {
  pageObject.warningAvailable(false)
})

Then('the floor should be complete', () => {
  pageObject.floorStatusShouldBeDone()
})
