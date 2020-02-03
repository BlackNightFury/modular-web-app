import { expect } from 'chai'
import InfiniteScroll from '@/../testing/integration/support/page_objects/common/infinite-scroll'

export default class SpacesTable extends InfiniteScroll {
  checkNotStartedStatus() {
    expect(this.component.exists('[data-test-selector="NOT_STARTED"]')).to.equal(true)
  }

  checkInProgressStatus() {
    expect(this.component.exists('[data-test-selector="IN_PROGRESS"]')).to.equal(true)
  }

  checkDoneStatus() {
    expect(this.component.exists('[data-test-selector="DONE"]')).to.equal(true)
  }

  checkInaccessibleStatus() {
    expect(this.component.exists('[data-test-selector="INACCESSIBLE"]')).to.equal(true)
  }
}
