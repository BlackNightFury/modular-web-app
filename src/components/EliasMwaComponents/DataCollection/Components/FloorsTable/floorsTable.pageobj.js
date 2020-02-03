import { expect } from 'chai'
import InfiniteScroll from '@/../testing/integration/support/page_objects/common/infinite-scroll'

export default class FloorsTable extends InfiniteScroll {
  get component() {
    return this.object.component
  }

  simulateMultiActionDisplay() {
    this.component
      .find('button[data-test-selector="floorstable_action_dropdown"]')
      .simulate('click')
  }

  checkNotStarted() {
    expect(this.component.exists('[data-test-selector="NOT_STARTED"]')).to.equal(true)
  }

  checkInProgress() {
    expect(this.component.exists('[data-test-selector="IN_PROGRESS"]')).to.equal(true)
  }

  checkDone() {
    expect(this.component.exists('[data-test-selector="DONE"]')).to.equal(true)
  }

  checkInaccessible() {
    expect(this.component.exists('[data-test-selector="INACCESSIBLE"]')).to.equal(true)
  }

  checkCompleteOptionAvailable(status) {
    expect(this.component.exists('[data-test-selector="complete_floor_button"]')).to.equal(status)
  }
}
