import { When, Then, Given } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import {
  MOCK_ASSETS,
  MOCK_SITES,
  MOCK_FACILITIES,
  MOCK_FLOORS,
  MOCK_SPACES,
} from '@/../testing/integration/__mock__/resources'
import LifeCycleAndReplacement from '@/components/EliasMwaComponents/Customer/Pages/LifeCycleAndReplacement'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './lifecycleAndReplacement.pageobj'

export default class LifeCycleAndReplacementTestHelper {
  constructor() {
    this.component = null
    this.mockedProps = {
      treeData: [],
      user: {
        tenantId: '672FB50-BE2B-405D-9526-CB81427B7B7E',
      },
      onGenerateReport: () => {},
    }
  }

  mockAssets() {
    this.mockedProps.assets = MOCK_ASSETS
    this.mockedProps.sites = MOCK_SITES
    this.mockedProps.facilities = MOCK_FACILITIES
    this.mockedProps.floors = MOCK_FLOORS
    this.mockedProps.spaces = MOCK_SPACES
  }

  mountWithProvider() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)
    this.component = mountWithProvider(<LifeCycleAndReplacement {...this.mockedProps} />)
  }
}

const object = new LifeCycleAndReplacementTestHelper()
const pageObject = new PageObject(object)

Given('various types of assets are provided for lifecycle dashboard page', () => {
  object.mockAssets()
})

When('I go to lifecycle and replacement cost dashboard page', () => {
  object.mountWithProvider()
})

Then('dashboard view for lifecycle and replacement cost dashboard should be shown', () => {
  pageObject.checkIfDashboardView()
})

When('I switch to list view on lifecycle dashboard', () => {
  pageObject.switchView()
})

Then('list view for lifecycle and replacement cost dashboard should be shown', () => {
  pageObject.checkIfListView()
})
