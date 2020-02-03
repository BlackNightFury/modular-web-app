import { expect } from 'chai'

export default class CopyAssets {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  get currentLocation() {
    return this.object.historyLogs.slice(-1).pop()
  }

  completeBtnDisabledShouldBeAfterUpdate(targetStatus) {
    this.component.update()

    const completeBtnSelector = 'button[data-test-selector="complete_copy"]'
    const completeFacilityBtn = this.component.find(completeBtnSelector)
    expect(completeFacilityBtn.prop('disabled')).to.equal(targetStatus)
  }

  openEditAssetDrawer() {
    const btnSelector = 'button[data-test-selector="assetstable_action_button"]'
    const componentInstance = this.component.instance()
    this.component
      .find(btnSelector)
      .first()
      .simulate('click')
    componentInstance.setState({
      isVirtual: true,
    })
    this.component.update()
  }

  checkVAssetsFieldsEditable() {
    this.component.update()
    expect(
      this.component.find('div[data-test-selector="edit-virtualasset-drawer"]'),
    ).to.have.lengthOf(1)
    const conditionSelect = this.component.find('div[data-test-selector="ant_select_box"]').first()
    expect(conditionSelect.prop('disabled')).not.to.equal(true)
    const installDateBox = this.component.find('input[data-test-selector="ant_year_picker"]')
    expect(installDateBox.prop('disabled')).not.to.equal(true)
  }
}
