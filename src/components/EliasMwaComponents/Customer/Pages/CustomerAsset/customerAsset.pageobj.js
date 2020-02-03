import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import _ from 'lodash'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import {
  MOCK_TREEDATA,
  MOCK_ASSETS,
  MOCK_SITES,
  MOCK_FACILITIES,
  MOCK_FLOORS,
  MOCK_SPACES,
} from '@/../testing/integration/__mock__/resources'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import TopBar from '@/components/EliasMwaComponents/Navigation/TopBar'
import CustomerAssets from '@/components/EliasMwaComponents/Customer/Pages/CustomerAsset'

export default class CustomerMyStateAsset {
  constructor() {
    this.newInitialState = _.cloneDeep(initialState)
    this.component = null
    this.mockedProps = {
      treeData: MOCK_TREEDATA,
      assets: MOCK_ASSETS,
      sites: MOCK_SITES,
      facilities: MOCK_FACILITIES,
      floors: MOCK_FLOORS,
      spaces: MOCK_SPACES,
      spaceName: '',
      isVAInSpace: true,
      user: this.newInitialState.user,
    }

    this.mockTopBarProps = {
      breadcrumbs: ['My Estate', 'Assets'],
      isTest: true,
    }
  }

  mount = () => {
    this.component = mount(<CustomerAssets {...this.mockedProps} />)
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
    ).to.equal('Assets')
  }

  changeFilterOption = value => {
    const componentInstance = this.component.instance()
    componentInstance.setState({
      filterKeys: value,
    })
    this.component = this.component.update()
  }

  checkIfFilteredByVirtual = () => {
    expect(this.component.find('tr[data-test-selector="assetstable_row"]')).to.have.lengthOf(0)
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

  checkIfSortedByQty = () => {
    const tableItems = this.component.find('tr[data-test-selector="assetstable_row"]')
    const columns = tableItems.last().find('td.ant-table-column-has-sorters').length
    expect(
      tableItems
        .first()
        .find('td.ant-table-column-has-sorters')
        .at(columns - 2)
        .text(),
    ).to.equal('1')
    expect(
      tableItems
        .last()
        .find('td.ant-table-column-has-sorters')
        .at(columns - 2)
        .text(),
    ).to.equal('128')
  }
}
