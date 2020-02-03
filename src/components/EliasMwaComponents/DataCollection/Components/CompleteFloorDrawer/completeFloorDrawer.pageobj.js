import { expect } from 'chai'

export default class CompleteFloorDrawer {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  get submittedFloor() {
    return this.object.submittedFloor
  }

  getWarningCount(warningKeys) {
    let errorsCnt = 0
    warningKeys.forEach(checkerKey => {
      errorsCnt += this.component
        .find(`[data-test-selector="${checkerKey}"]`)
        .first()
        .prop('showArrow')
        ? 1
        : 0
    })
    return errorsCnt
  }

  acceptCheckbox() {
    this.object.submittedFloor = null
    this.component
      .find('input[data-test-selector="complete-floor-checkbox"]')
      .simulate('change', { target: { checked: true } })
  }

  submitForm() {
    this.component.find('button[data-test-selector="complete-floor-submit"]').simulate('click')
  }

  spaceWarningAvailable(available) {
    const warningCount = this.getWarningCount(['NotDoneSpaces'])
    if (available) {
      expect(warningCount).to.not.equal(0)
    } else {
      expect(warningCount).to.equal(0)
    }
  }

  inaccessibleWarningAvailable(available) {
    const warningCount = this.getWarningCount(['InaccessibleSpaces'])
    if (available) {
      expect(warningCount).to.not.equal(0)
    } else {
      expect(warningCount).to.equal(0)
    }
  }

  compulsoryAssetsWarningAvailable(available) {
    const warningCount = this.getWarningCount(['CompulsoryAssets'])
    if (available) {
      expect(warningCount).to.not.equal(0)
    } else {
      expect(warningCount).to.equal(0)
    }
  }

  warningAvailable(available) {
    const warningCount = this.getWarningCount([
      'NotDoneSpaces',
      'InaccessibleSpaces',
      'CompulsoryAssets',
    ])
    if (available) {
      expect(warningCount).to.not.equal(0)
    } else {
      expect(warningCount).to.equal(0)
    }
  }

  floorStatusShouldBeDone() {
    expect(this.submittedFloor.status).to.equal('DONE')
  }
}
