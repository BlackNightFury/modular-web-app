import { expect } from 'chai'
import InfiniteScroll from '@/../testing/integration/support/page_objects/common/infinite-scroll'

export default class FacilitiesTable extends InfiniteScroll {
  get component() {
    return this.object.component
  }

  checkStatus(targetStatus) {
    expect(
      this.component
        .find('[data-test-selector="floortable_status_indicator"]')
        .first()
        .prop('statusdata'),
    ).to.equal(targetStatus)
  }
}
