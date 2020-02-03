import 'ignore-styles'
import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import { MOCK_ASSETS } from '@/../testing/integration/__mock__/resources'
import { getAllAssets } from '@/../testing/integration/__mock__/elasticsearch'
import { Antd } from '@/components/EliasMwaComponents/Customer/Pages/Home'

export default class customerHomePage {
  initializeData = () => {
    getAllAssets().then(() => {
      const componentInstance = this.component.instance()
      componentInstance.updateChartData(MOCK_ASSETS)
      this.component.update()
    })
  }

  mount() {
    const user = {}
    this.component = mount(<Antd user={user} history={[]} />)
  }

  checkChartData = () => {
    const state = this.component.state()
    expect(state.numberOfAssets).to.equal(2)
    expect(state.barChartData).to.have.property('testUser', 2)
    expect(state.pieChartData).to.have.property('B', 2)
  }
}
