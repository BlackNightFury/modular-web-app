import { expect } from 'chai'

export default class NewFacilityQuestionnaier {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkContinueButtonStatus(disabled) {
    const completeFacilityBtn = this.component.find('button[data-test-selector="form-submit"]')
    expect(completeFacilityBtn.prop('disabled')).to.equal(disabled)
  }

  completePreSurveyQuestionnaire() {
    this.component.find('input[data-test-selector*="form-checkbox"]').forEach(node => {
      node.simulate('change', { target: { checked: true } })
    })
  }
}
