import { expect } from 'chai'
import { mockStore } from '@/../testing/integration/__mock__/mock_store'

export default class ProfileMenu {
  constructor(object) {
    this.object = object
  }

  get component() {
    return this.object.component
  }

  simulateProfileButtonClick() {
    this.component
      .find('[data-test-selector="profile_button"]')
      .last()
      .simulate('click')
  }

  simulateLogoutClick() {
    this.simulateProfileButtonClick()
    this.component
      .find('[data-test-selector="profile_logout_button"]')
      .last()
      .simulate('click')
  }

  checkLogoutConfirmModal() {
    expect(this.component.exists('[data-test-selector="profile_logout_confirm_title"]')).to.equal(
      true,
    )
  }

  simulateCheckboxClickAndClickLogout() {
    this.component
      .find('[data-test-selector="understand_logout_checkbox"]')
      .last()
      .simulate('change', { target: { checked: true } })
    this.component
      .find('[data-test-selector="logout_and_delete_data"]')
      .last()
      .simulate('click')
  }

  setGlobalStore = () => {
    global.store = mockStore({
      user: {
        name: 'Tester',
        roles: ['Surveyor'],
        email: 'test@test.com',
      },
    })
  }

  checkProfilePanel() {
    const profilePanel = this.component.find('.ant-dropdown-menu')
    expect(profilePanel.contains('Tester')).to.equal(true)
    expect(profilePanel.contains('Surveyor')).to.equal(true)
    expect(profilePanel.contains('test@test.com')).to.equal(true)
  }

  static checkLocalStorageEmpty() {
    expect(global.localStorage.getItem('userInfo')).to.equal(null)
  }
}
