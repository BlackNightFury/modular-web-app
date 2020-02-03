import { expect } from 'chai'

export default class KnownIssues {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  checkDuplicateBarcodeIssuesShown(expectedNumber) {
    expect(this.component.find(`tr[data-test-selector="knownissuestable_row"]`)).to.have.lengthOf(
      expectedNumber,
    )
  }
}
