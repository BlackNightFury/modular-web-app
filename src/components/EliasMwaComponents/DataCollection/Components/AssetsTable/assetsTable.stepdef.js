import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import AssetsTable from '@/components/EliasMwaComponents/DataCollection/Components/AssetsTable'
import InfiniteScrollTestHelper from '@/../testing/integration/step_definitions/common/objects/infinite-scroll'
import PageObject from './assetsTable.pageobj'

export default class AssetsTableTestHelper extends InfiniteScrollTestHelper {
  constructor() {
    super()

    this.onDeleteTriggered = false
    this.mockedProps = {
      data: [],
      onChangeSortBy: () => {},
      project: {},
      columns: [
        {
          title: 'Name',
          dataIndex: 'type',
          key: 'type',
          editable: true,
        },
      ],
      onDelete: () => {
        this.onDeleteTriggered = true
      },
    }
    this.defaultItem = {
      id: '1',
      type: {
        virtual: false,
        value: 'Amplifier-40456',
      },
      images: [],
      facets: {},
      notes: {},
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<AssetsTable {...this.mockedProps} />)
  }

  mockStatus(targetStatus) {
    this.mockedProps.data = [
      {
        status: targetStatus,
      },
    ]
  }
}

const object = new AssetsTableTestHelper()
const pageObject = new PageObject(object)

When('the assets table is displayed', () => {
  object.mountWithProvider()
})

Given('assets count is less than page size', () => {
  object.mockEmpty()
})

Given('assets count is more than page size', () => {
  object.mockHundred()
})

Then('more button for assets should be disabled', () => {
  pageObject.moreButtonShouldBe(true)
})

Then('more button for assets should be enabled', () => {
  pageObject.moreButtonShouldBe(false)
})

When('I click more button for more assets', () => {
  pageObject.simulateLoadMore()
})

Then('it should show more assets', () => {
  pageObject.checkLoadedCount('assetstable_row', 20)
})

Then('the edit button on table item should be available', () => {
  pageObject.checkEditButtonAvailable()
})
