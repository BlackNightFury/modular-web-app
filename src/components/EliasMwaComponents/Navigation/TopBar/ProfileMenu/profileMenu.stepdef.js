import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import ProfileMenu from '@/components/EliasMwaComponents/Navigation/TopBar/ProfileMenu'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import PageObject from './profileMenu.pageobj'

export default class ProfileMenuTestHelper {
  constructor() {
    this.component = null
    this.mockedProps = {}
  }

  mockUnsyncedData() {
    this.mockedCache = {
      store: {
        getState() {
          return {
            'appsync-metadata': {
              snapshot: { enqueuedMutations: 1 },
            },
          }
        },
      },
    }
  }

  mountWithIntl() {
    this.component = mountWithIntl(
      <MockedProvider cache={this.mockedCache} addTypename={false} mocks={[]}>
        <ProfileMenu {...this.mockTopBarProps} />
      </MockedProvider>,
    )
  }
}

const object = new ProfileMenuTestHelper()
const pageObject = new PageObject(object)

Given('Unsynced data is available', () => {
  object.mockUnsyncedData()
  object.mountWithIntl()
})

When('I click logout', () => {
  pageObject.simulateLogoutClick()
})

Then('it should show logout confirm modal', () => {
  pageObject.checkLogoutConfirmModal()
})

When('I confirm checkbox and click logout and delete data', () => {
  pageObject.simulateCheckboxClickAndClickLogout()
})

Then('local storage should be empty', () => {
  PageObject.checkLocalStorageEmpty()
})

When('I click profile button', () => {
  pageObject.setGlobalStore()
  object.mountWithIntl()
  pageObject.simulateProfileButtonClick()
})

Then('it should show correct user data', () => {
  pageObject.checkProfilePanel()
})
