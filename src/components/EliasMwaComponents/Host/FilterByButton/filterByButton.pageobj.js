import { expect } from 'chai'

export default class AssetsCardList {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  get showFilter() {
    return this.object.mockedProps.showFilter
  }

  get filterValues() {
    return this.object.filterValues
  }

  checkFilterIconAvailable() {
    expect(this.component.exists('[data-test-selector="filtericon_container"]')).to.equal(true)
  }

  simulateFilterIconClick() {
    this.component.find('[data-test-selector="filtericon_container"]').simulate('click')
  }

  checkIfTreeSelectExpanded() {
    expect(this.showFilter).to.equal(true)
  }

  simulateAddingFilter() {
    const searchableTreeInputEle = this.component
      .find('[data-test-selector="filterbybutton_searchabletree"]')
      .last()
    searchableTreeInputEle.simulate('click')
    const assetClassEle = this.component
      .find('.ant-select-dropdown .ant-select-tree-treenode-switcher-close .ant-select-tree-title')
      .last()
      .childAt(0)
    assetClassEle.simulate('click')
    this.component.update()
    const virtualAssetEle = this.component
      .find('.ant-select-dropdown .ant-select-tree-treenode-switcher-close .ant-select-tree-title')
      .last()
    virtualAssetEle.simulate('click')
    this.component.update()
  }

  simulateAddingSecondFilter() {
    const assetsClasses = this.component.find(
      '.ant-select-dropdown .ant-select-tree-treenode-switcher-close .ant-select-tree-title',
    )
    const coreAssetEle = assetsClasses.at(assetsClasses.length - 2)
    coreAssetEle.simulate('click')
    this.component.update()
  }

  checkFilterChangeEvent() {
    expect(this.filterValues).to.not.equal(null)
  }

  checkAllAssetsClassAvailable() {
    const searchableTreeInputEle = this.component
      .find('[data-test-selector="filterbybutton_searchabletree"]')
      .last()
    searchableTreeInputEle.simulate('click')
    const assetClassEle = this.component
      .find('.ant-select-dropdown .ant-select-tree-treenode-switcher-close .ant-select-tree-title')
      .last()
      .childAt(0)
    assetClassEle.simulate('click')
    this.component.update()

    expect(this.component.contains('Core')).to.equal(true)
    expect(this.component.contains('Virtual')).to.equal(true)
  }

  checkOnlyCoreAssetsClassAvailable() {
    const searchableTreeInputEle = this.component
      .find('[data-test-selector="filterbybutton_searchabletree"]')
      .last()
    searchableTreeInputEle.simulate('click')
    const assetClassEle = this.component
      .find('.ant-select-dropdown .ant-select-tree-treenode-switcher-close .ant-select-tree-title')
      .last()
      .childAt(0)
    assetClassEle.simulate('click')
    this.component.update()

    expect(this.component.contains('Core')).to.equal(true)
    expect(this.component.contains('Virtual')).to.equal(false)
  }

  checkIncludeBothFilters() {
    expect(this.filterValues.length).to.equal(2)
  }

  checkIncludeOnlyRelevantAssetTypes() {
    const searchableTreeInputEle = this.component
      .find('[data-test-selector="filterbybutton_searchabletree"]')
      .last()
    searchableTreeInputEle.simulate('click')
    const assetTypeEle = this.component
      .find('.ant-select-dropdown .ant-select-tree-treenode-switcher-close .ant-select-tree-title')
      .first()
      .childAt(0)
    assetTypeEle.simulate('click')
    this.component.update()

    expect(this.component.contains('Access')).to.equal(true)
    expect(this.component.contains('Controls')).to.equal(false)
  }
}
