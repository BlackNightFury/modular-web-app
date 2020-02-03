import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import { columns } from '@/components/EliasMwaComponents/DataCollection/Pages/Home'
import FacilitiesTable from '@/components/EliasMwaComponents/DataCollection/Components/FacilitiesTable'
import InfiniteScrollTestHelper from '@/../testing/integration/step_definitions/common/objects/infinite-scroll'
import PageObject from './facilitiesTable.pageobj'

export default class FacilitiesTableTestHelper extends InfiniteScrollTestHelper {
  constructor() {
    super()
    this.mockedProps = {
      data: [],
      onChangeSortBy: () => {},
      project: {},
      columns: columns.filter(({ dataIndex }) => dataIndex === 'status'),
    }
    this.defaultItem = {
      status: 'DONE',
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<FacilitiesTable {...this.mockedProps} />)
  }

  mockStatus(targetStatus) {
    this.mockedProps.data = [
      {
        status: targetStatus,
      },
    ]
  }
}

const object = new FacilitiesTableTestHelper()
const pageObject = new PageObject(object)

Given('a facility is not started', () => {
  object.mockStatus('NOT_STARTED')
})

When('the facilities table is displayed', () => {
  object.mountWithProvider()
})

Then('the facility status indicator should be not started', () => {
  pageObject.checkStatus('NOT_STARTED')
})

Given('a facility is in progress', () => {
  object.mockStatus('IN_PROGRESS')
})

Then('the facility status indicator should be in progress', () => {
  pageObject.checkStatus('IN_PROGRESS')
})

Given('a facility is done', () => {
  object.mockStatus('DONE')
})

Then('the facility status indicator should be done', () => {
  pageObject.checkStatus('DONE')
})

Given('a facility is inaccessible', () => {
  object.mockStatus('INACCESSIBLE')
})

Then('the facility status indicator should be inaccessible', () => {
  pageObject.checkStatus('INACCESSIBLE')
})

Given('facilities count is less than page size', () => {
  object.mockEmpty()
})

Given('facilities count is more than page size', () => {
  object.mockHundred()
})

Then('more button for facilities should be disabled', () => {
  pageObject.moreButtonShouldBe(true)
})

Then('more button for facilities should be enabled', () => {
  pageObject.moreButtonShouldBe(false)
})

When('I click more button for more facilities', () => {
  pageObject.simulateLoadMore()
})

Then('it should show more facilities', () => {
  pageObject.checkLoadedCount('facilitiestable_row', 20)
})
