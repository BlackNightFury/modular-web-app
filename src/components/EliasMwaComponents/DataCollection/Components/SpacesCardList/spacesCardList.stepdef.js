import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import SpacesCardList from '@/components/EliasMwaComponents/DataCollection/Components/SpacesCardList'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './spacesCardList.pageobj'

export default class SpacesCardListTestHelper {
  constructor() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)

    this.component = null
    this.mockedProps = {
      data: [
        {
          id: '1',
          name: 'Test Space',
          status: 'NOT_STARTED',
          notes: {
            reminder: null,
          },
          availableDate: '2019-07-19T06:12:05.842Z',
          assets: 0,
        },
      ],
      projectName: 'Test Project',
      facilityName: 'Test Facility',
      floorName: 'Test Floor',
      onPrimaryAction: () => {},
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<SpacesCardList {...this.mockedProps} />)
  }
}

const object = new SpacesCardListTestHelper()
const pageObject = new PageObject(object)

When('I switch to card view on spaces list view', () => {
  object.mountWithProvider()
})

Then('the spaces cardview should be displayed', () => {
  pageObject.checkCardView()
})

When('I click assets link', () => {
  pageObject.clickAssetLink()
})

Then('it should be redirected to space page', () => {
  pageObject.checkSpacePageRedirection()
})

When('I click favorite button', () => {
  pageObject.clickFavorite()
})

Then('the space should be one of favorite space', () => {
  object.mountWithProvider()
  pageObject.checkFavorite()
})
