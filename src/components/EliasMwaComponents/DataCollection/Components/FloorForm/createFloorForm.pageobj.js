import { expect } from 'chai'

export default class CreateFloorForm {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  get submittedValues() {
    return this.object.submittedValues
  }

  createFloor(options) {
    this.component
      .find('input[data-test-selector="FloorForm_name"]')
      .simulate('change', { target: { value: 'Test Floor 1' } })
    this.component
      .find('[data-test-selector="FloorForm_status"] .ant-select-selection__placeholder')
      .simulate('click')
    this.component
      .find('[value="NOT_STARTED"] li')
      .first()
      .simulate('click')
    if (options && options.withReminder) {
      this.component
        .find('input[data-test-selector="reminder_checkbox"]')
        .simulate('change', { target: { checked: true } })
      this.component
        .find('textarea[data-test-selector="reminder_notes"]')
        .simulate('change', { target: { value: 'Test Reminder Notes 1' } })
    }
    this.component
      .find('[data-test-selector="FloorForm"]')
      .last()
      .simulate('submit')
  }

  clickSubmitWithoutData() {
    this.component
      .find('[data-test-selector="FloorForm"]')
      .last()
      .simulate('submit')
  }

  checkValidationMessages() {
    this.component.update()
    expect(
      this.component.find('[data-test-selector="floorform-errorslist"]').children().length,
    ).to.be.above(0)
    expect(
      this.component.find('[data-test-selector="create-floor-form-validation-card"]').children()
        .length,
    ).to.be.above(0)
  }

  checkValidationForEachField() {
    this.component.update()
    expect(this.component.exists('.ant-form-item-control .ant-form-explain')).to.equal(true)
  }

  checkFloor() {
    expect(this.submittedValues.name).to.equal('Test Floor 1')
    expect(this.submittedValues.status).to.equal('NOT_STARTED')
  }

  checkDrawerClosed() {
    expect(this.component.exists('.form-drawer-content-body')).to.equal(false)
  }

  checkReminderNote() {
    expect(this.submittedValues.notes.reminder).to.equal('Test Reminder Notes 1')
  }
}
