import { expect } from 'chai'

export default class AssetsCardList {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkIfDashboardView() {
    expect(this.component.exists('[data-test-selector="assetmanagement_dashboardview"]')).to.equal(
      true,
    )
  }

  checkIfListView() {
    expect(this.component.exists('[data-test-selector="assetmanagement_listingview"]')).to.equal(
      true,
    )
  }

  switchView() {
    this.component
      .find('[data-test-selector="assetmanagement_viewswitch"]')
      .last()
      .simulate('click')
  }

  clickExportCAFM = () => {
    this.component
      .find('[data-test-selector="page-export-cafm-btn"]')
      .first()
      .simulate('click')
  }

  checkReportInfoCard = () => {
    expect(this.component.exists('[data-test-selector="report-generating-card"]')).to.equal(true)
  }

  checkReportSuccessCard = () => {
    expect(this.component.exists('[data-test-selector="report-success-card"]')).to.equal(true)
  }
}
