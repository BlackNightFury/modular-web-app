import { expect } from 'chai'

export default class FormBuilder {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  simulateValidation() {
    this.component
      .find('[data-test-selector="formbuilder_form"]')
      .first()
      .simulate('submit')
    this.component
      .find('[data-test-selector="formbuilder_form"]')
      .first()
      .prop('validate')({})
  }

  checkValidationMessagesList() {
    this.component.update()
    expect(
      this.component.find('[data-test-selector="formbuilder-errorslist"]').children().length,
    ).to.be.above(0)
    expect(
      this.component.find('[data-test-selector="form-validation-card"]').children().length,
    ).to.be.above(0)
  }

  checkValidationForEachField() {
    this.component.update()
    expect(this.component.exists('.ant-form-item-control-wrapper .ant-form-explain')).to.equal(true)
  }
}
