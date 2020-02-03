import { expect } from 'chai'

export default class CreateAssetForm {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  get submittedValues() {
    return this.object.submittedValues
  }

  createAsset(options) {
    this.component.find('button[data-test-selector="assetform_dummydata"]').simulate('click')
    this.component
      .find('[data-test-selector="ant_select_box"]')
      .first()
      .simulate('click')
    this.component
      .find('input[data-test-selector="ant_year_picker"]')
      .simulate('change', { target: { value: '2019' } })

    if (options && options.withReminder) {
      this.component
        .find('input[data-test-selector="reminder_checkbox"]')
        .simulate('change', { target: { checked: true } })
      this.component
        .find('[data-test-selector="reminder_notes"]')
        .first()
        .simulate('change', { target: { value: 'Test Reminder Notes' } })
    }

    if (options && options.fromLastBarcode) {
      this.component.find('button[data-test-selector="barcodeincreaser_button"]').simulate('click')
    }

    if (options && options.wrongValueType) {
      this.component
        .find('input#root_Others_rating')
        .simulate('change', { target: { value: '5aaa' } })
    }

    if (options && options.duplicatedBarcode) {
      this.component
        .find('input#root_Others_barcode')
        .simulate('change', { target: { value: '111111111' } })
    }

    this.component
      .find('[data-test-selector="assetformbuilder_form"]')
      .last()
      .simulate('submit')
  }

  checkSubmittedValue() {
    expect(this.submittedValues).to.have.property('facets')
    const facetsValue = this.submittedValues.facets
    expect(facetsValue['install-date']).to.equal('2019')
    expect(facetsValue.barcode).to.equal('318072191')
    expect(facetsValue.quantity).to.equal(1)
  }

  checkReminderNotes() {
    expect(this.submittedValues).to.have.property('notes')
    const notesValue = this.submittedValues.notes
    expect(notesValue.reminder).to.equal('Test Reminder Notes')
  }

  checkNextBarcode() {
    expect(this.submittedValues).to.have.property('facets')
    const facetsValue = this.submittedValues.facets
    expect(facetsValue.barcode).to.equal('318072192')
  }

  checkValidationMessage(options) {
    if (options && options.duplicatedBarcode) {
      expect(
        this.component
          .find('[data-test-selector="formbuilder-errorslist"]')
          .first()
          .find('.ant-form-explain')
          .first()
          .text(),
      ).to.equal('Barcode: Duplicated Barcode')
    } else {
      expect(this.component.exists('.field-error.has-error')).to.equal(true)
    }
  }
}
