import { expect } from 'chai'
import InfiniteScroll from '@/../testing/integration/support/page_objects/common/infinite-scroll'

export default class AssetsTable extends InfiniteScroll {
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

  checkEditButtonAvailable() {
    expect(this.component.exists('[data-test-selector="assetstable_action_button"]')).to.equal(true)
  }

  simulateEditButtonClick() {
    const editBtn = this.component.find('button[data-test-selector="assetstable_action_button"]')
    editBtn.simulate('click')
  }

  checkEditEventTrigger() {
    expect(this.object.onEditTriggered).to.equal(true)
  }

  simulateEllipsesClick() {
    const ellipsesBtn = this.component
      .find('button[data-test-selector="assetstable_action_dropdown"]')
      .first()
    ellipsesBtn.simulate('click')
  }

  checkActionsDropdownAvailable() {
    expect(this.component.exists('[eventKey="active_asset"]')).to.equal(true)
  }

  simulateDeleteDropdownItemClick = () => {
    this.component
      .find('[eventKey="delete_asset"]')
      .first()
      .simulate('click')
  }

  checkDeleteEventTrigger = () => {
    expect(this.object.onDeleteTriggered).to.equal(true)
  }
}
