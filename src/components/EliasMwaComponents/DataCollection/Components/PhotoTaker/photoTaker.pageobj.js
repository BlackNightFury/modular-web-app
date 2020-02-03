import { expect } from 'chai'

export default class NewFacilityQuestionnaier {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  clickAddButton() {
    this.component
      .find('[data-test-selector="phototaker_add_btn"]')
      .last()
      .simulate('click')
  }

  checkMaxNumberImageValidation() {
    expect(
      this.component.exists('[data-test-selector="maximum_image_validation_message"]'),
    ).to.equal(true)
  }

  clickDeleteButton() {
    this.component
      .find('button[data-test-selector="phototaker_delete_image_button"]')
      .last()
      .simulate('click')
  }

  checkDeleteConfirmMsg() {
    expect(this.component.exists('[data-test-selector="delete_confirm_message"]')).to.equal(true)
  }

  clickDeleteConfirmBtn() {
    this.component
      .find('button[data-test-selector="phototaker_delete_confirm_button"]')
      .last()
      .simulate('click')
  }

  checkImageDeletion() {
    expect(this.object.deletedPhoto).to.equal(true)
  }
}
