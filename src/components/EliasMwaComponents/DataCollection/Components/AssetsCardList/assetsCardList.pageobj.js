import { expect } from 'chai'
import { Tooltip } from 'antd'

export default class AssetsCardList {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkAssetCardViewDisplayed() {
    expect(this.component.exists('[data-test-selector="asset_card"]')).to.equal(true)
  }

  checkVirtualAssetCardViewDisplayed() {
    expect(this.component.exists('[data-test-selector="virtualasset_card"]')).to.equal(true)
  }

  checkTooltipAvailable() {
    expect(this.component.exists(Tooltip)).to.equal(true)
  }

  checkEditButtonAvailable() {
    if (this.object.isVirtualAssets) {
      expect(
        this.component.exists('[data-test-selector="virtualassetscard_action_button"]'),
      ).to.equal(true)
    } else {
      expect(this.component.exists('[data-test-selector="assetscard_action_button"]')).to.equal(
        true,
      )
    }
  }

  simulateEditButtonClick() {
    let editBtn
    if (this.object.isVirtualAssets) {
      editBtn = this.component.find('button[data-test-selector="virtualassetscard_action_button"]')
    } else {
      editBtn = this.component.find('button[data-test-selector="assetscard_action_button"]')
    }
    editBtn.simulate('click')
  }

  checkEditEventTrigger() {
    expect(this.object.onEditTriggered).to.equal(true)
  }

  simulateEllipsesClick() {
    let ellipsesBtn
    if (this.object.isVirtualAssets) {
      ellipsesBtn = this.component.find(
        'button[data-test-selector="virtualassetscard_action_dropdown"]',
      )
    } else {
      ellipsesBtn = this.component.find('button[data-test-selector="assetscard_action_dropdown"]')
    }
    ellipsesBtn.simulate('click')
  }

  checkActionsDropdownAvailable() {
    expect(this.component.exists('[eventKey="delete_asset"]')).to.equal(true)
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
