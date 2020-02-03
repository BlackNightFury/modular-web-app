import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import FloorsTable from '@/components/EliasMwaComponents/DataCollection/Components/FloorsTable'
import InfiniteScrollTestHelper from '@/../testing/integration/step_definitions/common/objects/infinite-scroll'
import { columns } from '@/components/EliasMwaComponents/DataCollection/Pages/Facility'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './floorsTable.pageobj'

export default class FloorsTableTestHelper extends InfiniteScrollTestHelper {
  constructor() {
    super()
    this.mockedProps = {
      data: [],
      projectName: 'mockedProject',
      facilityName: 'mockedFacility',
      highlighted: null,
      columns: columns.filter(({ dataIndex }) => dataIndex === 'status'),
      isVAInSpace: true,
    }
    this.defaultItem = {
      status: 'DONE',
    }
    this.mountWithProvider()
  }

  mountWithProvider() {
    this.component = mountWithProvider(<FloorsTable {...this.mockedProps} />)
  }

  mockNotStartedStatus() {
    this.mockedProps.data = [
      {
        id: '1',
        status: 'NOT_STARTED',
        subSpaces: [],
      },
    ]
  }

  mockInProgressStatus() {
    this.mockedProps.data = [
      {
        id: '1',
        status: 'IN_PROGRESS',
        subSpaces: [],
      },
    ]
  }

  mockDoneStatus() {
    this.mockedProps.data = [
      {
        id: '1',
        status: 'DONE',
        subSpaces: [],
      },
    ]
  }

  mockDoneWithInaccessibleSpaceStatus() {
    this.mockedProps.data = [
      {
        id: '1',
        status: 'DONE',
        subSpaces: [
          {
            id: 'subspaces1',
            status: 'INACCESSIBLE',
          },
        ],
      },
    ]
  }
}

const object = new FloorsTableTestHelper()
const pageObject = new PageObject(object)

Given('a floor is not started', () => {
  object.mockNotStartedStatus()
})

When('the floors table is displayed', () => {
  object.mountWithProvider()
})

Then('the status indicator should be not started', () => {
  pageObject.checkNotStarted()
})

Given('a floor is in progress', () => {
  object.mockInProgressStatus()
})

Then('status indicator should be in progress', () => {
  pageObject.checkInProgress()
})

Given('a floor is done', () => {
  object.mockDoneStatus()
})

Then('status indicator should be done', () => {
  pageObject.checkDone()
})

Given('a floor has an inaccessible space', () => {
  object.mockDoneWithInaccessibleSpaceStatus()
})

Then('status indicator should be inaccessible', () => {
  pageObject.checkInaccessible()
})

Given('a floor has been started', () => {
  object.mockInProgressStatus()
})

When('multi actions display', () => {
  object.mountWithProvider()
  pageObject.simulateMultiActionDisplay()
})

Then('the complete option should be available', () => {
  pageObject.checkCompleteOptionAvailable(true)
})

Given('a floor has been completed', () => {
  object.mockDoneStatus()
})

Then('the complete option should not be available', () => {
  pageObject.checkCompleteOptionAvailable(false)
})

Given('floors count is less than page size', () => {
  object.mockEmpty()
})

Given('floors count is more than page size', () => {
  object.mockHundred()
})

Then('more button for floors should be disabled', () => {
  pageObject.moreButtonShouldBe(true)
})

Then('more button for floors should be enabled', () => {
  pageObject.moreButtonShouldBe(false)
})

When('I click more button for more floors', () => {
  pageObject.simulateLoadMore()
})

Then('it should show more floors', () => {
  pageObject.checkLoadedCount('floorstable_row', 20)
})
