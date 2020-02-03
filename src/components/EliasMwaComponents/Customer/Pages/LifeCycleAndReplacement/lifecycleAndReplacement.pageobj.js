import { expect } from 'chai'

export default class AssetsCardList {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkIfDashboardView() {
    expect(this.component.exists('[data-test-selector="lifecycle_dashboardview"]')).to.equal(true)
  }

  checkIfListView() {
    expect(this.component.exists('[data-test-selector="lifecycle_listingview"]')).to.equal(true)
  }

  switchView() {
    this.component
      .find('[data-test-selector="lifecycle_viewswitch"]')
      .last()
      .simulate('click')
  }
}
