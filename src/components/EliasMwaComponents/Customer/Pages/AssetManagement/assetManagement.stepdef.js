import { When, Then, Given } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { BrowserRouter as Router } from 'react-router-dom'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import {
  MOCK_ASSETS,
  MOCK_SITES,
  MOCK_FACILITIES,
  MOCK_FLOORS,
  MOCK_SPACES,
} from '@/../testing/integration/__mock__/resources'
import AssetManagementPage from '@/components/EliasMwaComponents/Customer/Pages/AssetManagement'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './assetManagement.pageobj'

export default class AssetManagementPageTestHelper {
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

  mockReportGenerating = () => {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore({
      ...newInitialState,
      report: {
        reports: [
          {
            id: 'test_report_id',
            type: 'EXPORT_CAFM',
            isGenerated: false,
            isGenerating: true,
          },
        ],
      },
    })
    this.component = mountWithProvider(
      <Router>
        <AssetManagementPage {...this.mockedProps} />
      </Router>,
    )
  }

  mockReportGenerated = () => {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore({
      ...newInitialState,
      report: {
        reports: [
          {
            id: 'test_report_id',
            type: 'EXPORT_CAFM',
            isGenerated: true,
            isGenerating: false,
          },
        ],
      },
    })
    this.component = mountWithProvider(
      <Router>
        <AssetManagementPage {...this.mockedProps} />
      </Router>,
    )
  }

  mountWithProvider() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)
    this.component = mountWithProvider(
      <Router>
        <AssetManagementPage {...this.mockedProps} />
      </Router>,
    )
  }
}

const object = new AssetManagementPageTestHelper()
const pageObject = new PageObject(object)

Given('various types of assets are provided', () => {
  object.mockAssets()
})

When('I go to asset management dashboard page', () => {
  object.mountWithProvider()
})

Then('dashboard view for asset management dashboard should be shown', () => {
  pageObject.checkIfDashboardView()
})

When('I switch to list view', () => {
  pageObject.switchView()
})

Then('list view for asset management dashboard should be shown', () => {
  pageObject.checkIfListView()
})

When('I click CAFM export', () => {
  pageObject.clickExportCAFM()
})

Then('I should be able to see info card', () => {
  object.mockReportGenerating()
  pageObject.checkReportInfoCard()
})

When('the export is generated', () => {
  object.mockReportGenerated()
})

Then('I should be able to see success card', () => {
  pageObject.checkReportSuccessCard()
})
