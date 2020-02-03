import { When, Then, Given } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import AssetsCardList from '@/components/EliasMwaComponents/DataCollection/Components/AssetsCardList'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './assetsCardList.pageobj'

export default class AssetsCardListTestHelper {
  constructor() {
    this.component = null
    this.onEditTriggered = false
    this.onDeleteTriggered = false
    this.mockedProps = {
      subType2SysType: {},
      data: [
        {
          id: '1',
          type: {
            virtual: false,
            value: 'Amplifier-40456',
          },
          images: [],
          facets: {},
          notes: {},
        },
      ],
      onDelete: () => {
        this.onDeleteTriggered = true
      },
      onEdit: () => {
        this.onEditTriggered = true
      },
      onMenu: () => {},
      onUpdate: () => {},
      tenant: {},
      isVirtualAssets: false,
      isVAInSpace: true,
      readOnly: false,
      isCopyAssets: false,
    }
    this.isVirtualAssets = false
  }

  setAssetMockProps = () => {
    this.mockedProps = {
      ...this.mockedProps,
      data: [
        {
          id: '1',
          type: {
            virtual: false,
            value: 'Amplifier-40456',
          },
          images: [],
          facets: {},
          notes: {},
        },
      ],
      isVirtualAssets: false,
    }
    this.isVirtualAssets = false
  }

  setVirtualAssetMockProps = () => {
    this.mockedProps = {
      ...this.mockedProps,
      data: [
        {
          id: '1',
          type: {
            virtual: true,
            value: 'Card Readers-40452',
          },
          images: [],
          facets: {},
          notes: {},
        },
      ],
    }
    this.isVirtualAssets = true
  }

  mountWithProvider() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)
    this.component = mountWithProvider(<AssetsCardList {...this.mockedProps} />)
  }
}

const object = new AssetsCardListTestHelper()
const pageObject = new PageObject(object)

Given('I am on the asset list view', () => {
  object.setAssetMockProps()
})

Given('I am on the virtual asset list view', () => {
  object.setVirtualAssetMockProps()
})

Then('the asset cardview should be displayed', () => {
  pageObject.checkAssetCardViewDisplayed()
})

Then('the virtual asset cardview should be displayed', () => {
  pageObject.checkVirtualAssetCardViewDisplayed()
})

When('I switch to card view', () => {
  object.mountWithProvider()
})

Then('the card view tooltip should be available', () => {
  pageObject.checkTooltipAvailable()
})

Then('the edit button should be available', () => {
  pageObject.checkEditButtonAvailable()
})

When('I click edit button', () => {
  pageObject.simulateEditButtonClick()
})

Then('edit event should be triggered', () => {
  pageObject.checkEditEventTrigger()
})

When('I click ellipses dropdown', () => {
  pageObject.simulateEllipsesClick()
})

Then('actions dropdown for the asset should be shown', () => {
  pageObject.checkActionsDropdownAvailable()
})

When('I delete the item', () => {
  pageObject.simulateDeleteDropdownItemClick()
})

Then('delete event should be triggered', () => {
  pageObject.checkDeleteEventTrigger()
  object.mountWithProvider()
})

When('I click the multi action button', () => {
  pageObject.simulateEllipsesClick()
})

Then('the actions list should be shown', () => {
  pageObject.checkActionsDropdownAvailable()
})
