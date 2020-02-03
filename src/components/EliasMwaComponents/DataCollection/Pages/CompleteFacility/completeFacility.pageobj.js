import { expect } from 'chai'

export default class CompleteFacility {
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

    const completeBtnSelector = 'button[data-test-selector="complete-facility-btn"]'
    const completeFacilityBtn = this.component.find(completeBtnSelector)
    expect(completeFacilityBtn.prop('disabled')).to.equal(targetStatus)
  }

  completeCheckbox() {
    const checkBoxSelector = 'input[data-test-selector*="form-checkbox"]'
    this.component.find(checkBoxSelector).forEach(node => {
      node.simulate('change', { target: { checked: true } })
    })
    this.component
      .find('input[data-test-selector="data_will_not_editable_confirm"]')
      .simulate('change', { target: { checked: true } })
  }

  completeTextArea() {
    const textAreaSelector = 'textarea[data-test-selector*="form-multiline-text"]'
    this.component.find(textAreaSelector).forEach(node => {
      node.simulate('change', { target: { value: 'Test' } })
    })
  }

  submitForm() {
    this.component.find('[submitTestSelector="complete-facility-btn"] form').simulate('submit')
  }

  checkHistory(location) {
    expect(this.currentLocation).to.equal(location)
  }
}
