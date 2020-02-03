import { When, Then, Given } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import { KnownIssuesComponent } from '@/components/EliasMwaComponents/DataCollection/Components/KnownIssues'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import { MOCK_DUPLICATE_ALL_ASSETS } from '@/../testing/integration/__mock__/resources'
import PageObject from './knownIssues.pageobj'

export default class KnownIssuesTestHelper {
  constructor() {
    this.component = null

    this.mockedProps = {
      allRecords: {
        facilities: [],
        floors: [],
        spaces: [],
        assets: [],
      },
      assets: [],
    }
  }

  mockDuplicateBarcodeAssets = () => {
    this.mockedProps.allRecords = MOCK_DUPLICATE_ALL_ASSETS
  }

  mockBarcodeDuplicationIssue = () => {
    this.mockedProps.assets = [{ id: 'BLbvB_D_D' }, { id: '4SaYG2j4u' }]
    global.localStorage.setItem(
      'qaIssues',
      '[{"type":"Duplicate barcode number","details":[{"text":"facility 1, SLAV TENANT TESTING, Space 12, Amplifier-40456","id":"BLbvB_D_D"},{"text":"facility 1, SLAV TENANT TESTING, Space 12, Fixed Ladders-40482","id":"4SaYG2j4u"}],"info":"522528505","id":"BLbvB_D_D","isError":true}]',
    )
  }

  refresh = () => {
    this.component.find('button[data-test-selector="refresh"]').simulate('click')
  }

  updateBarcodeAndRefresh = () => {
    this.mockedProps.allRecords = {
      facilities: [{ id: 'FACILITY_ID' }],
      floors: [{ id: 'FLOOR_ID_1' }, { id: 'FLOOR_ID_2' }],
      spaces: [{ id: 'SPACE_ID_1' }, { id: 'SPACE_ID_2' }],
      assets: [
        {
          facets: { barcode: 'DUPLICATE 1' },
          facilityId: 'FACILITY_ID',
          floorId: 'FLOOR_ID_1',
          spaceId: 'SPACE_ID_1',
          id: 'ASSET_ID_1',
        },
        {
          facets: { barcode: 'DUPLICATE 2' },
          facilityId: 'FACILITY_ID',
          floorId: 'FLOOR_ID_2',
          spaceId: 'SPACE_ID_1',
          id: 'ASSET_ID_2',
        },
      ],
    }
    this.component.find('button[data-test-selector="refresh"]').simulate('click')
  }

  mountWithIntl() {
    const { user } = global.store.getState()

    this.component = mountWithIntl(
      <MockedProvider addTypename={false} mocks={[]} cache={this.mockedApolloCache}>
        <KnownIssuesComponent {...this.mockedProps} user={user} dispatch={() => {}} />
      </MockedProvider>,
    )
  }
}

const object = new KnownIssuesTestHelper()
const pageObject = new PageObject(object)

When('there is barcode duplication issue', () => {
  object.mockBarcodeDuplicationIssue()
  object.mountWithIntl()
})

Then('the known issue should be displayed', () => {
  pageObject.checkDuplicateBarcodeIssuesShown(2)

  global.localStorage.removeItem('qaIssues')
})

When('user updates the barcode and press refresh button', () => {
  object.updateBarcodeAndRefresh()
})

When('I refresh the known issues', () => {
  object.refresh()
})

Then('there should be no known issues', () => {
  object.mountWithIntl()
  pageObject.checkDuplicateBarcodeIssuesShown(0)
})

Given('assets with duplicate barcodes exist', () => {
  object.mockDuplicateBarcodeAssets()
  object.mountWithIntl()
})
