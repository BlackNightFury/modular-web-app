import { expect } from 'chai'
import InfiniteScroll from '@/../testing/integration/support/page_objects/common/infinite-scroll'

export default class AssetManagementListing extends InfiniteScroll {
  get component() {
    return this.object.component
  }

  simulateEllipsesClick() {
    const ellipsesBtn = this.component
      .find('button[data-test-selector="assetstable_action_dropdown"]')
      .first()
    ellipsesBtn.simulate('click')
  }

  checkActionsDropdownAvailable() {
    expect(this.component.exists('[eventKey="edit_asset"]')).to.equal(true)
  }

  simulateEditDropdownItemClick = () => {
    this.component
      .find('[eventKey="edit_asset"]')
      .first()
      .simulate('click')
  }

  checkEditEventTrigger = () => {
    expect(this.object.onEditTriggered).to.equal(true)
  }
}
