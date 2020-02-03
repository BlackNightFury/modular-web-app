import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import _ from 'lodash'
import { BrowserRouter as Router } from 'react-router-dom'
import router from 'umi/router'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import MenuLeft from '@/components/EliasMwaComponents/Navigation/Menu/MenuLeft'

export default class MenuLeftDrawer {
  constructor() {
    this.mountWithProvider()
    this.newInitialState = _.cloneDeep(initialState)
  }

  mountWithProvider() {
    this.component = mountWithProvider(
      <Router>
        <MenuLeft />
      </Router>,
    )
  }

  mockCustomerLoggedIn = () => {
    this.newInitialState.user.roles = ['customer']
  }

  mockSurveyorLoggedIn = () => {
    this.newInitialState.user.roles = ['surveyor']
  }

  setGlobalStore() {
    global.store = mockStore(this.newInitialState)
  }

  checkIfCustomerMenuLeftDrawer = () => {
    expect(this.component.exists('[data-test-selector="customer-menu-left"]')).to.equal(true)
  }

  checkIfMyEstateAssetsPagePanel = () => {
    expect(this.component.exists('[data-test-selector="asset_link"]')).to.equal(true)
  }

  clickMyEstateAssetsPagePanel = () => {
    this.component.find('[data-test-selector="asset_link"]').simulate('click')
  }

  checkHistory = location => expect(router.url).to.equal(location)
}
