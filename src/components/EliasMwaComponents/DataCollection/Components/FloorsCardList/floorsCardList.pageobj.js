import { expect } from 'chai'

export default class FloorsCardList {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkCardView() {
    expect(this.component.exists('[data-test-selector="floorscardlist_card"]')).to.equal(true)
  }
}
