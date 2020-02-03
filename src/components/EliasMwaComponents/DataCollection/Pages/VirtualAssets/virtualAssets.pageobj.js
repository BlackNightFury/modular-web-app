import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import _ from 'lodash'
import moment from 'moment'
import { mount } from 'enzyme'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'
import { MOCK_TREEDATA, MOCK_VIRTUAL_ASSETS } from '@/../testing/integration/__mock__/resources'
import VirtualAssets from '@/components/EliasMwaComponents/DataCollection/Pages/VirtualAssets'

export default class VirtualAssetsTestHelper {
  constructor() {
    this.newInitialState = _.cloneDeep(initialState)
    this.component = null
    this.mockedProps = {
      treeData: MOCK_TREEDATA,
      assets: MOCK_VIRTUAL_ASSETS,
      project: { preSurveyQuestionnaire: 'basic-pre-survey' },
      facility: { id: 'AAEGCQ8LD' },
      user: this.newInitialState.user,
      match: { params: {} },
      dispatch: () => {},
      onUpdate: () => {
        const updatedAssets = MOCK_VIRTUAL_ASSETS.map(asset => {
          if (asset.type === 'Chilled Beams-103224') {
            return {
              ...asset,
              createdAt: `${moment().toISOString()}`,
            }
          }
          return asset
        })
        const newMockedProps = {
          ...this.mockedProps,
          assets: updatedAssets,
        }
        this.component.setProps(newMockedProps)
      },
    }
  }

  mount = () => {
    this.component = mount(<VirtualAssets {...this.mockedProps} />)
  }

  setGlobalStore = () => {
    global.store = mockStore(this.newInitialState)
  }

  switchCardView = () => {
    this.component
      .find('[data-test-selector="cardswitch"]')
      .first()
      .simulate('click')
  }

  increaseVirtualAssetQuantity = () => {
    this.component
      .find('[data-test-selector="quantityincreaser_button"]')
      .last()
      .simulate('click')
  }

  checkOrder = () => {
    expect(
      this.component
        .find('[data-test-selector="virtualasset_card"]')
        .first()
        .text(),
    ).match(/Card Readers/)
    expect(
      this.component
        .find('[data-test-selector="virtualasset_card"]')
        .last()
        .text(),
    ).match(/Chilled Beams/)
  }
}
