import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import FloorsCardList from '@/components/EliasMwaComponents/DataCollection/Components/FloorsCardList'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './floorsCardList.pageobj'

export default class FloorsCardListTestHelper {
  constructor() {
    const newInitialState = _.cloneDeep(initialState)
    global.store = mockStore(newInitialState)

    this.component = null
    this.mockedProps = {
      data: [
        {
          id: '1',
          status: 'IN_PROGRESS',
          subAssets: [],
          subSpaces: [],
          notes: {},
          project: {},
        },
      ],
      projectName: 'Test Project',
      facilityName: 'Test Facility',
      onPrimaryAction: () => {},
    }
  }

  mountWithProvider() {
    this.component = mountWithProvider(<FloorsCardList {...this.mockedProps} />)
  }
}

const object = new FloorsCardListTestHelper()
const pageObject = new PageObject(object)

When('I switch to card view on floors list view', () => {
  object.mountWithProvider()
})

Then('the floor cardview should be displayed', () => {
  pageObject.checkCardView()
})
