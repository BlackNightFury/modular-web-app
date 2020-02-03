import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import SpacesTable from '@/components/EliasMwaComponents/DataCollection/Components/SpacesTable'
import InfiniteScrollTestHelper from '@/../testing/integration/step_definitions/common/objects/infinite-scroll'
import { columns } from '@/components/EliasMwaComponents/DataCollection/Pages/Floor'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './spacesTable.pageobj'

export default class SpacesTableTestHelper extends InfiniteScrollTestHelper {
  constructor() {
    super()

    this.mockedProps = {
      data: [],
      projectName: 'mockedProject',
      facilityName: 'mockedFacility',
      floorName: 'mockedFloor',
      highlighted: null,
      columns: columns.filter(({ dataIndex }) => dataIndex === 'status'),
      isVAInSpace: true,
    }
    this.defaultItem = {
      status: 'DONE',
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<SpacesTable {...this.mockedProps} />)
  }

  mockNotStarted() {
    this.mockedProps.data = [
      {
        status: 'NOT_STARTED',
      },
    ]
  }

  mockInProgress() {
    this.mockedProps.data = [
      {
        status: 'IN_PROGRESS',
      },
    ]
  }

  mockDoneStatus() {
    this.mockedProps.data = [
      {
        status: 'DONE',
      },
    ]
  }

  mockInaccessibleStatus() {
    this.mockedProps.data = [
      {
        status: 'INACCESSIBLE',
      },
    ]
  }
}

const object = new SpacesTableTestHelper()
const pageObject = new PageObject(object)

Given('a space is not started', () => {
  object.mockNotStarted()
})

When('the spaces table is displayed', () => {
  object.mountWithProvider()
})

Then('the space status indicator should be not started', () => {
  pageObject.checkNotStartedStatus()
})

Given('a space is in progress', () => {
  object.mockInProgress()
})

Then('the space status indicator should be in progress', () => {
  pageObject.checkInProgressStatus()
})

Given('a space is done', () => {
  object.mockDoneStatus()
})

Then('the space status indicator should be done', () => {
  pageObject.checkDoneStatus()
})

Given('a space is inaccessible', () => {
  object.mockInaccessibleStatus()
})

Then('the space status indicator should be inaccessible', () => {
  pageObject.checkInaccessibleStatus()
})

Given('spaces count is less than page size', () => {
  object.mockEmpty()
})

Given('spaces count is more than page size', () => {
  object.mockHundred()
})

Then('more button for spaces should be disabled', () => {
  pageObject.moreButtonShouldBe(true)
})

Then('more button for spaces should be enabled', () => {
  pageObject.moreButtonShouldBe(false)
})

When('I click more button for more spaces', () => {
  pageObject.simulateLoadMore()
})

Then('it should show more spaces', () => {
  pageObject.checkLoadedCount('spacestable_row', 20)
})
