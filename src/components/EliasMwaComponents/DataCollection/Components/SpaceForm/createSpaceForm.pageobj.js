import { expect } from 'chai'

export default class CreateSpaceForm {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  get submittedValues() {
    return this.object.submittedValues
  }

  createSpace(options) {
    this.component
      .find('input[data-test-selector="spaceform_name"]')
      .simulate('change', { target: { value: 'Test Space 1' } })
    this.component
      .find('input[data-test-selector="spaceform_localname"]')
      .simulate('change', { target: { value: 'Test Local Space 1' } })
    this.component
      .find('[data-test-selector="spaceform_type"] .ant-select-selection__placeholder')
      .simulate('click')
    this.component
      .find('[value="Accommodation"] li')
      .first()
      .simulate('click')

    this.component
      .find('[data-test-selector="spaceform_status"] .ant-select-selection__placeholder')
      .simulate('click')
    this.component
      .find('[value="NOT_STARTED"] li')
      .first()
      .simulate('click')
    this.component
      .find('li')
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
      .find('[data-test-selector="form-submit"]')
      .last()
      .simulate('submit')
  }

  checkDrawerClosed() {
    expect(this.component.exists('.form-drawer-content-body')).to.equal(false)
  }

  createSpaceAddAsset(options) {
    this.component
      .find('input[data-test-selector="spaceform_name"]')
      .simulate('change', { target: { value: 'Test Space 2' } })
    this.component
      .find('input[data-test-selector="spaceform_localname"]')
      .simulate('change', { target: { value: 'Test Local Space 2' } })
    this.component
      .find('[data-test-selector="spaceform_type"] .ant-select-selection__placeholder')
      .simulate('click')
    this.component
      .find('[value="Accommodation"] li')
      .first()
      .simulate('click')

    this.component
      .find('[data-test-selector="spaceform_status"] .ant-select-selection__placeholder')
      .simulate('click')
    this.component
      .find('[value="NOT_STARTED"] li')
      .first()
      .simulate('click')
    this.component
      .find('li')
      .first()
      .simulate('click')
    if (options && options.withReminder) {
      this.component
        .find('input[data-test-selector="reminder_checkbox"]')
        .simulate('change', { target: { checked: true } })
      this.component
        .find('textarea[data-test-selector="reminder_notes"]')
        .simulate('change', { target: { value: 'Test Reminder Notes 2' } })
    }
    this.component
      .find('[data-test-selector="spaceform_multiactionopen"]')
      .last()
      .simulate('click')
    this.component
      .find('[data-test-selector="spaceform_saveandaddasset"]')
      .last()
      .simulate('click')
  }

  clickSubmitWithoutData() {
    this.component
      .find('[data-test-selector="form-submit"]')
      .last()
      .simulate('submit')
  }

  checkValidationMessages() {
    this.component.update()
    expect(
      this.component.find('[data-test-selector="spaceform-errorslist"]').children().length,
    ).to.be.above(0)
    expect(
      this.component.find('[data-test-selector="create-space-form-validation-card"]').children()
        .length,
    ).to.be.above(0)
  }

  checkValidationForEachField() {
    this.component.update()
    expect(this.component.exists('.ant-form-item-control .ant-form-explain')).to.equal(true)
  }

  checkSpace() {
    expect(this.submittedValues.name).to.equal('Test Space 1')
    expect(this.submittedValues.localName).to.equal('Test Local Space 1')
    expect(this.submittedValues.type).to.equal('Accommodation')
    expect(this.submittedValues.status).to.equal('NOT_STARTED')
  }

  checkSpaceAddAsset() {
    expect(this.submittedValues.name).to.equal('Test Space 2')
    expect(this.submittedValues.localName).to.equal('Test Local Space 2')
    expect(this.submittedValues.type).to.equal('Accommodation')
    expect(this.submittedValues.status).to.equal('NOT_STARTED')
  }

  checkReminderNote() {
    expect(this.submittedValues.notes.reminder).to.equal('Test Reminder Notes 1')
  }
}
