import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { MockedProvider } from 'react-apollo/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
import { mockStore, initialState } from '../../../__mock__/mock_store'
import { mountWithIntl } from '../intl-config'
import TopBar from '@/components/EliasMwaComponents/Navigation/TopBar'

export default class WithTopBar {
  constructor() {
    this.newInitialState = _.cloneDeep(initialState)
  }

  mountTopBar = () => {
    this.topBar = mountWithIntl(
      <MockedProvider addTypename={false} mocks={[]}>
        <Router>
          <TopBar {...this.mockTopBarProps} />
        </Router>
      </MockedProvider>,
    )
  }

  setGlobalStore = () => {
    global.store = mockStore(this.newInitialState)
  }

  mockCustomerLoggedIn = () => {
    this.newInitialState.user.roles = ['customer']
    if (this.mockedProps && this.mockedProps.user) {
      this.mockedProps.user.roles = ['customer']
    }
  }
}
