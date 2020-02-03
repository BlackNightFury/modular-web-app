import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import CustomerAssetDetail from './index'

export default class CustomerAssetDetailHelper {
  constructor() {
    this.component = null
    this.mockedProps = {
      project: 'UAT Drop 2 (VS)n1LMMmTYWO',
      facility: 'facility 3bl-oUWt1jR',
      floor: '1',
      space: '1',
      match: {
        params: {},
      },
      asset: {
        id: 'd_8YM05xA',
        facilityId: '4_eSwJgR8E',
        floorId: 'BnBM6SWw',
        spaceId: 'ttRhU65S',
        assetType: {
          description: 'Amplifier',
          legacyId: 28753,
          tree: ['ACCESS', 'AMPLIFIER'],
          virtual: false,
        },
        images: [],
        facets: {
          'asset-status-2': 'Maintain',
          quantity: 1,
          'serial-number': 'clothing',
          accessibility: 'High Level (>3m)',
          criticality: 'Urgent',
          'install-date': '2019-11-13T22:00:00.000Z',
          manufacturer: 'Dunelm',
          condition: 'A',
          'existing-asset-number': 'running',
          'asset-status': 'Not Working',
          model: 'long',
          barcode: '3441126',
          status: 'Scrapped',
        },
        notes: {
          condition: 'Some posit the dynamic hippopotamus to be less than diligent?',
          notes: 'Unable to access asset. Details taken from O&M’s',
          description: 'DB 1',
        },
        projectId: 'xWr8gV-zY',
        siteId: '_4YlTfHUuH',
        spons: {
          eol: '2029-11-13',
          lifecycle: 10,
          replacementCost: 3500,
          totalReplacementCost: 3500,
        },
        type: 'Amplifier-28753',
      },
    }
  }

  mount = ({ withRating }) => {
    global.store = mockStore(initialState)
    this.mockedProps.asset.facets.rating = withRating ? 3 : undefined
    this.component = mountWithProvider(<CustomerAssetDetail {...this.mockedProps} />)
  }

  checkRating = ({ withRating }) => {
    const ratingElm = this.component.find('[data-test-selector="customer_asset_details_rating"]')
    expect(ratingElm.first().text()).to.equal(withRating ? '3' : '-')
  }
}
