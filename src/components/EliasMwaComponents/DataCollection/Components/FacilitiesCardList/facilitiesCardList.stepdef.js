import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import FacilitiesCardList from '@/components/EliasMwaComponents/DataCollection/Components/FacilitiesCardList'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './facilitiesCardList.pageobj'

export default class FacilitiesCardListTestHelper {
  constructor() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)

    this.component = null
    this.mockedProps = {
      data: [
        {
          id: '1',
          rag: 'A',
          docs: [],
          project: 'Edge hill university (VAS)',
          facets: {},
          notes: {},
          assets: 2,
          isCompleted: false,
        },
      ],
      onPrimaryAction: () => {},
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<FacilitiesCardList {...this.mockedProps} />)
  }
}

const object = new FacilitiesCardListTestHelper()
const pageObject = new PageObject(object)

When('I switch to card view on facilities list view', () => {
  object.mountWithProvider()
})

Then('the facility cardview should be displayed', () => {
  pageObject.checkCardView()
})
