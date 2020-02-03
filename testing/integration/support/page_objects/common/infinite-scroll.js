import { expect } from 'chai'

export default class InfiniteScroll {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  moreButtonShouldBe(disabled) {
    this.component.update()
    const moreBtn = this.component.find('button[data-test-selector="load-more"]')
    expect(moreBtn.prop('disabled')).to.equal(disabled)
  }

  simulateLoadMore() {
    this.component.update()
    const moreBtn = this.component.find('button[data-test-selector="load-more"]')
    moreBtn.simulate('click')
  }

  checkLoadedCount(testSelector, targetNumber) {
    this.component.update()
    expect(this.component.find(`tr[data-test-selector="${testSelector}"]`)).to.have.lengthOf(
      targetNumber,
    )
  }
}
