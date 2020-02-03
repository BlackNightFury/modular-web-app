import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import _ from 'lodash'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import { MOCK_TREEDATA, MOCK_UNTAGGED_ASSETS } from '@/../testing/integration/__mock__/resources'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import TopBar from '@/components/EliasMwaComponents/Navigation/TopBar'
import UntaggedAssets from '@/components/EliasMwaComponents/DataCollection/Pages/UntaggedAssets'

export default class UntaggedAssetsTestHelper {
  constructor() {
    this.newInitialState = _.cloneDeep(initialState)
    this.component = null
    this.mockedProps = {
      treeData: MOCK_TREEDATA,
      assets: MOCK_UNTAGGED_ASSETS,
      project: { preSurveyQuestionnaire: 'basic-pre-survey' },
      facility: { id: 'AAEGCQ8LD' },
      user: this.newInitialState.user,
      match: { params: {} },
      dispatch: () => {},
    }

    this.mockTopBarProps = {
      breadcrumbs: ['774897 Facility 1', 'Untagged Assets'],
      isTest: true,
    }
  }

  mount = () => {
    this.component = mount(<UntaggedAssets {...this.mockedProps} />)
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

  checkBreadcrumb = () => {
    const breadcrumbs = this.topBar.find('[data-test-selector="breadcrumb-text"]')
    expect(breadcrumbs).to.have.lengthOf(2)

    expect(
      breadcrumbs
        .first()
        .find('a')
        .first()
        .text(),
    ).to.equal('774897 Facility 1')

    expect(
      breadcrumbs
        .last()
        .find('span')
        .first()
        .text(),
    ).to.equal('Untagged Assets')
  }

  changeFilterOption = value => {
    const componentInstance = this.component.instance()

    componentInstance.setState({
      filterKeys: value,
    })
    this.component = this.component.update()
  }

  checkIfFilteredByChilledBeams = () => {
    expect(this.component.find('tr[data-test-selector="assetstable_row"]')).to.have.lengthOf(1)
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

    expect(
      tableItems
        .first()
        .find('span[data-test-selector="untaggedassets_qty"]')
        .text(),
    ).to.equal('1')
    expect(
      tableItems
        .last()
        .find('span[data-test-selector="untaggedassets_qty"]')
        .text(),
    ).to.equal('128')
  }
}
