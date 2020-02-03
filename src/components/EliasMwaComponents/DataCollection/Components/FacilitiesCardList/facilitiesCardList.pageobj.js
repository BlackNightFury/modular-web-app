import { expect } from 'chai'

export default class FacilitiesCardList {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkCardView() {
    expect(this.component.exists('[data-test-selector="facilitiescardlist_card"]')).to.equal(true)
  }
}
