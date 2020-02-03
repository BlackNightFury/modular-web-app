import { When, Then } from 'cucumber'
import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import TopBar from '@/components/EliasMwaComponents/Navigation/TopBar'
import Home from '@/components/EliasMwaComponents/DataCollection/Pages/Home'
import PageObject from './syncStatus.pageobj'

export default class SyncStatusTestHelper {
  constructor() {
    this.mockTopBarProps = {
      breadcrumbs: [],
    }
    this.mockHomePage = {
      facilities: [],
    }
    this.newInitialState = _.cloneDeep(initialState)
  }

  mockOnline() {
    this.newInitialState.user.status = {
      online: true,
      lastUpdated: moment().toISOString(),
      indicator: 'green',
    }
  }

  mockOffline() {
    this.newInitialState.user.status.online = false
  }

  mountTopBar() {
    this.topBar = mountWithIntl(
      <MockedProvider addTypename={false} mocks={[]}>
        <Router>
          <TopBar {...this.mockTopBarProps} />
        </Router>
      </MockedProvider>,
    )
  }

  mountHomepage() {
    this.newInitialState.user.tenantId = 'admin'
    this.newInitialState.user.tenant = { virtual_asset_in_space: 'test' }
    window.mwa_config.tenants.admin = { virtual_asset_in_space: 'test' }
    this.homePage = mount(
      <Router>
        <Home store={mockStore(this.newInitialState)} {...this.mockHomePage} />
      </Router>,
    )
  }

  notYetReachedOkTimeout() {
    this.newInitialState.user.status.lastUpdated = moment().toISOString()
    this.newInitialState.user.status.indicator = 'green'
  }

  setGlobalStore() {
    global.store = mockStore(this.newInitialState)
  }

  mockExceedOkTimeout() {
    this.newInitialState.user.status.lastUpdated = moment()
      .subtract(4, 'hours')
      .toISOString()
    this.newInitialState.user.status.indicator = 'amber'
  }

  mockExceedWarningTimeout() {
    this.newInitialState.user.status.lastUpdated = moment()
      .subtract(7, 'hours')
      .toISOString()
    this.newInitialState.user.status.indicator = 'red'
  }
}

const object = new SyncStatusTestHelper()
const pageObject = new PageObject(object)

When('I am online', () => {
  object.mockOnline()
})

Then('the status should be online', () => {
  object.mountTopBar()
  pageObject.checkOnline()
})

When('I am offline', () => {
  object.mockOffline()
})

When('I have not yet reached the ok timeout', () => {
  object.notYetReachedOkTimeout()
})

Then('the status should be offline', () => {
  object.setGlobalStore()
  object.mountTopBar()
  pageObject.checkOffline()
})

When('I have exceeded the ok timeout', () => {
  object.mockExceedOkTimeout()
})

Then('the status should be not synched', () => {
  object.setGlobalStore()
  object.mountTopBar()
  pageObject.checkStatusNotSynced()
})

Then('the warning card should be shown', () => {
  object.mountHomepage()
  pageObject.checkWarningCardShown()
})

When('I have exceeded the warning timeout', () => {
  object.mockExceedWarningTimeout()
})

Then('the status should be data out of date', () => {
  object.setGlobalStore()
  object.mountTopBar()
  pageObject.checkStatusOutOfDate()
})

Then('the error card should be shown', () => {
  object.setGlobalStore()
  object.mountHomepage()
  pageObject.checkErrorCardShown()
})
