import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import { columns } from '@/components/EliasMwaComponents/Customer/Pages/AssetManagement'
import AssetManagementListing from '@/components/EliasMwaComponents/Customer/Components/AssetManagementListing'
import InfiniteScrollTestHelper from '@/../testing/integration/step_definitions/common/objects/infinite-scroll'
import PageObject from './AssetManagementListing.pageobj'

export default class AssetManagementListingTestHelper extends InfiniteScrollTestHelper {
  constructor() {
    super()

    this.onEditTriggered = false
    this.mockedProps = {
      viewMode: true,
      filteredAssets: [],
      sortOption: {
        isAscending: true,
        field: 'type',
      },
      onChangeSortBy: () => {},
      treeData: {},
      facilities: [],
      projects: [],
      floors: [],
      spaces: [],
      columns,
      onEdit: () => {
        this.onEditTriggered = true
      },
    }
    this.defaultItem = {
      id: '1',
      type: {
        virtual: false,
        value: 'Amplifier-40456',
      },
      Quantity: 1,
      images: [],
      facets: {},
      notes: {},
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<AssetManagementListing {...this.mockedProps} />)
  }

  mockEmpty() {
    this.mockedProps.filteredAssets = []
  }

  mockHundred(fillData) {
    this.mockedProps.filteredAssets = Array(100)
      .fill(fillData || this.defaultItem)
      .map((item, idx) => ({
        ...item,
        id: idx.toString(),
      }))
  }
}

const object = new AssetManagementListingTestHelper()
const pageObject = new PageObject(object)

When('the Asset Management List is displayed', () => {
  object.mountWithProvider()
})

Given('asset list count is less than page size', () => {
  object.mockEmpty()
})

Given('asset list count is more than page size', () => {
  object.mockHundred()
})

Then('more button for asset list should be disabled', () => {
  pageObject.moreButtonShouldBe(true)
})

Then('more button for asset list should be enabled', () => {
  pageObject.moreButtonShouldBe(false)
})

When('I click more button', () => {
  pageObject.simulateLoadMore()
})

Then('more assets should be shown', () => {
  pageObject.checkLoadedCount('assetstable_row', 20)
})

When('I click ellipses dropdown menu', () => {
  pageObject.simulateEllipsesClick()
})

Then('dropdown menu for the asset should be shown', () => {
  pageObject.checkActionsDropdownAvailable()
})

When('I edit the item', () => {
  pageObject.simulateEditDropdownItemClick()
})

Then('the edit event should be triggered', () => {
  pageObject.checkEditEventTrigger()
})
