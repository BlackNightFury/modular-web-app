import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import { InMemoryCache } from 'apollo-cache-inmemory'
import CompleteFacility from '@/components/EliasMwaComponents/DataCollection/Pages/CompleteFacility'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import PageObject from './completeFacility.pageobj'

export default class CompleteFacilityTestHelper {
  constructor() {
    this.component = null
    this.mockedApolloCache = new InMemoryCache({ addTypename: false })
    this.mockedApolloCache.store = {
      subscribe: () => {},
      getState: () => ({
        'appsync-metadata': { snapshot: { enqueuedMutations: false } },
        offline: { online: true },
      }),
    }
    this.historyLogs = []
    this.historyMock = { push: url => this.historyLogs.push(url) }
    this.mockedProps = {
      allRecords: {
        facilities: [],
        floors: [],
        spaces: [],
        assets: [],
      },
      facility: {
        id: 'test-facility',
      },
      isCompleted: false,
      isLastFacility: false,
      match: {
        params: {
          facilityName: 'test-facility',
          projectName: 'test-project',
        },
      },
      project: {
        preSurveyQuestionnaire: 'basic-pre-survey',
      },
      onAddPreSurveyorResponse: () => {},
      onAddCompletion: () => {},
      onUpdateCompletion: () => {},
    }
  }

  mountWithIntl() {
    const { user } = global.store.getState()
    user.facilityPSQCompleted = [
      { facilityId: this.mockedProps.facility.id, formId: 'basic-pre-survey' },
    ]
    user.tenantId = 'admin'
    user.tenant = { virtual_asset_in_space: 'test' }
    window.mwa_config.tenants.admin = { virtual_asset_in_space: 'test' }

    this.component = mountWithIntl(
      <MockedProvider addTypename={false} mocks={[]} cache={this.mockedApolloCache}>
        <CompleteFacility
          {...this.mockedProps}
          user={user}
          dispatch={() => {}}
          history={this.historyMock}
        />
      </MockedProvider>,
    )
  }
}

const object = new CompleteFacilityTestHelper()
const pageObject = new PageObject(object)

When('I navigate to the completion page', () => {
  object.mountWithIntl()
})

Then('the complete button should be disabled', () => {
  pageObject.completeBtnDisabledShouldBeAfterUpdate(true)
})

When('I complete the form', () => {
  pageObject.completeCheckbox()
  pageObject.completeTextArea()
})

Then('the complete button should be enabled', () => {
  pageObject.completeBtnDisabledShouldBeAfterUpdate(false)
})

When('I submit the form', () => {
  pageObject.submitForm()
})

Then('I should be taken to my work', () => {
  pageObject.checkHistory('/')
})
