import { expect } from 'chai'

export default class SyncStatus {
  constructor(object) {
    this.object = object
  }

  get topBar() {
    return this.object.topBar
  }

  get homePage() {
    return this.object.homePage
  }

  checkOnline() {
    expect(
      this.topBar
        .find('[data-test-selector="sync-status-text"]')
        .first()
        .text(),
    ).to.equal('Live')
  }

  checkOffline() {
    expect(
      this.topBar
        .find('[data-test-selector="sync-status-text"]')
        .first()
        .text(),
    ).to.equal('Offline')
  }

  checkStatusNotSynced() {
    expect(
      this.topBar
        .find('[data-test-selector="sync-status-text"]')
        .first()
        .text(),
    ).to.equal('Not Synced')
  }

  checkWarningCardShown() {
    expect(this.homePage.find('[data-test-selector="data-sync-warning-card"]').exists()).to.equal(
      true,
    )
    expect(
      this.homePage
        .find('[data-test-selector="data-sync-warning-card"]')
        .first()
        .find('.ant-alert-description')
        .text(),
    ).to.equal('Please allow your work to sync at the earliest opportunity')
  }

  checkStatusOutOfDate() {
    expect(
      this.topBar
        .find('[data-test-selector="sync-status-text"]')
        .first()
        .text(),
    ).to.equal('Data Out Of Date')
  }

  checkErrorCardShown() {
    expect(this.homePage.find('[data-test-selector="data-sync-warning-card"]').exists()).to.equal(
      true,
    )
    expect(
      this.homePage
        .find('[data-test-selector="data-sync-warning-card"]')
        .first()
        .find('.ant-alert-description')
        .text(),
    ).to.equal('Please ensure you sync your work before the end of the day')
  }
}
