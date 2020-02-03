import { expect } from 'chai'

export default class Facility {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkPSQWarningCard = () => {
    expect(this.component.exists('.ant-alert')).to.equal(true)
  }

  checkFacilityCompletionReadonlyInfoCard = () => {
    expect(
      this.component.exists('[data-test-selector="facility-completed-read-only-warning-card"]'),
    ).to.equal(true)
  }

  checkProjectReadonlyInfoCard = () => {
    expect(this.component.exists('[data-test-selector="project-read-only-warning-card"]')).to.equal(
      true,
    )
  }

  checkCompletionWarningCard = visible => {
    expect(this.component.exists('[data-test-selector="completion-warning-card"]')).to.equal(
      visible,
    )
  }

  checkStatusFilter = () => {
    expect(this.component.exists('[data-test-selector="status-filter"]')).to.equal(true)
  }
}
