import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import _ from 'lodash'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import { MOCK_FACILITIES } from '@/../testing/integration/__mock__/resources'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import TopBar from '@/components/EliasMwaComponents/Navigation/TopBar'
import CustomerFacility from '@/components/EliasMwaComponents/Customer/Pages/CustomerFacility'

export default class CustomerMyEstateFacility {
  constructor() {
    this.newInitialState = _.cloneDeep(initialState)
    this.component = null
    this.mockedProps = {
      facilities: MOCK_FACILITIES,
      user: this.newInitialState.user,
    }

    this.mockTopBarProps = {
      breadcrumbs: ['My Estate', 'Facilities'],
      isTest: true,
    }
  }

  mount = () => {
    this.component = mount(<CustomerFacility {...this.mockedProps} />)
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
    this.mockedProps.user.roles = ['customer']
  }

  checkBreadcrumb = () => {
    const breadcrumbs = this.topBar.find('[data-test-selector="breadcrumb-text"]')
    expect(breadcrumbs).to.have.lengthOf(2)

    expect(
      breadcrumbs
        .first()
        .find('a')
        .first()
        .text(),
    ).to.equal('My Estate')
    expect(
      breadcrumbs
        .last()
        .find('span')
        .first()
        .text(),
    ).to.equal('Facilities')
  }

  changeFilterOption = value => {
    const componentInstance = this.component.instance()
    componentInstance.setState({
      statusFilter: value,
    })
    this.component = this.component.update()
  }

  checkIfFilteredByNotStarted = () => {
    expect(this.component.find('tr[data-test-selector="facilitiestable_row"]')).to.have.lengthOf(2)
  }

  changeSortOption = value => {
    const componentInstance = this.component.instance()
    componentInstance.setState({
      sortOption: {
        field: value,
        isAscending: true,
      },
    })
    this.component = this.component.update()
  }

  checkIfSortedByAssets = () => {
    const tableItems = this.component.find('tr[data-test-selector="facilitiestable_row"]')
    expect(
      tableItems
        .first()
        .find('span[data-test-selector="facility_assets"]')
        .last()
        .text(),
    ).to.equal('0')
    expect(
      tableItems
        .last()
        .find('span[data-test-selector="facility_assets"]')
        .last()
        .text(),
    ).to.equal('4')
  }
}
