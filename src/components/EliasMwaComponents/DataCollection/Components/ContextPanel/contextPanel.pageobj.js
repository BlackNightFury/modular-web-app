import { expect } from 'chai'
import router from 'umi/router'

export default class ContextPanel {
  constructor(object) {
    this.object = object
    this.router = router
  }

  get component() {
    return this.object.component
  }

  simulateFacilitySelect() {
    this.component
      .find('[data-test-selector="contextpanel_searchfacility"] span.ant-select')
      .simulate('click')
    this.component.update()
    this.component
      .find('.ant-select-dropdown-search input')
      .simulate('change', { target: { value: 'facility' } })
    this.component.update()
    const facilityComponent = this.component
      .find('span.ant-select-tree-node-content-wrapper span.ant-select-tree-title')
      .last()
    facilityComponent.children(0).simulate('click')
  }

  simulateFloorSelect() {
    this.component
      .find('[data-test-selector="contextpanel_searchfacility"] span.ant-select')
      .simulate('click')
    this.component.update()
    this.component
      .find('.ant-select-dropdown-search input')
      .simulate('change', { target: { value: 'floor' } })
    this.component.update()
    const floorComponent = this.component
      .find('span.ant-select-tree-node-content-wrapper span.ant-select-tree-title')
      .last()
    floorComponent.children(0).simulate('click')
  }

  simulateSpaceSelect() {
    this.component
      .find('[data-test-selector="contextpanel_searchfacility"] span.ant-select')
      .simulate('click')
    this.component.update()
    this.component
      .find('.ant-select-dropdown-search input')
      .simulate('change', { target: { value: 'space' } })
    this.component.update()
    const spaceComponent = this.component
      .find('span.ant-select-tree-node-content-wrapper span.ant-select-tree-title')
      .last()
    spaceComponent.children(0).simulate('click')
  }

  simulateGoClick() {
    const goButton = this.component
      .find('[data-test-selector="contextpanel_searchfacility_go"]')
      .last()
    goButton.prop('onClick')()
  }

  checkIfFacilityPage() {
    expect(this.router.url).to.equal(
      '/data-collection/992313-my-project/facilities/103243-facility-3',
    )
  }

  checkIfFloorPage() {
    expect(this.router.url).to.equal(
      '/data-collection/992313-my-project/facilities/103243-facility-3/floors/n81dy6ieh-second-floor',
    )
  }

  checkIfSpacePage() {
    expect(this.router.url).to.equal(
      '/data-collection/992313-my-project/facilities/103243-facility-3/floors/vkewngyjv-third-floor/spaces/dehir3ymu-newspace1',
    )
  }
}
