import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import _ from 'lodash'
import Facility from '@/components/EliasMwaComponents/DataCollection/Pages/Facility'
import PageObject from './facility.pageobj'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import { mockStore, initialState } from '@/../testing/integration/__mock__/mock_store'

export default class FacilityHelper {
  constructor() {
    this.component = null

    this.mockedProps = {
      readOnly: false,
      readOnlyReason: null,
      project: {},
      facility: {},
      floors: [],
      facilities: [],
      spaceTypes: [],
      mandatoryTypes: [],
      user: {},
      isVAInSpace: false,
      match: { params: {} },
    }

    this.isCheckingFacilityCompletion = false
  }

  mountWithProvider = () => {
    global.store = mockStore(initialState)
    this.component = mountWithProvider(<Facility {...this.mockedProps} />)
  }

  mountWithPSQNotCompleted = () => {
    this.mockedProps = {
      ...this.mockedProps,
      readOnlyReason: 'PSQNotCompleted',
      readOnly: true,
    }
    this.isCheckingFacilityCompletion = false
    this.component = mountWithProvider(<Facility {...this.mockedProps} />)
  }

  mountWithProjectReadonly = () => {
    this.mockedProps = {
      ...this.mockedProps,
      readOnlyReason: 'ProjectReadOnly',
      completion: {
        completedDatasPendingForNotification: [],
      },
      readOnly: true,
    }
    this.isCheckingFacilityCompletion = false
    this.component = mountWithProvider(<Facility {...this.mockedProps} />)
  }

  mountWithFacilityCompleted = () => {
    this.mockedProps = {
      ...this.mockedProps,
      readOnlyReason: 'FacilityCompleted',
      readOnly: true,
    }
    this.isCheckingFacilityCompletion = true

    const newInitialState = _.cloneDeep(initialState)
    newInitialState.completion = {
      completedDatasPendingForNotification: [
        {
          id: 'test',
          name: 'test',
          isEnabled: false,
        },
      ],
    }
    global.store = mockStore(newInitialState)
    this.component = mountWithProvider(<Facility {...this.mockedProps} />)
  }

  mount = () => {
    this.mockedProps = {
      ...this.mockedProps,
      readOnly: false,
    }
    this.isCheckingFacilityCompletion = false
    this.component = mountWithProvider(<Facility {...this.mockedProps} />)
  }
}

const object = new FacilityHelper()
const pageObject = new PageObject(object)

When('the pre surveyor questionnaire is not completed', () => {
  object.mountWithFacilityCompleted()
})
Then('a warning card should be shown', () => {
  pageObject.checkPSQWarningCard()
})
When('the facility is completed', () => {
  object.mountWithFacilityCompleted()
})
Then('an info card should be shown', () => {
  if (object.isCheckingFacilityCompletion) {
    pageObject.checkFacilityCompletionReadonlyInfoCard()
  } else {
    pageObject.checkProjectReadonlyInfoCard()
  }
})
When('the project is readonly', () => {
  object.mountWithProjectReadonly()
})

Then('the completed warning card should be shown', () => {
  pageObject.checkCompletionWarningCard(true)
})

Then('the completed warning card should be hidden after 5 seconds', { timeout: 10000 }, () => {
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 5000)
  })
  return promise.then(() => {
    object.mountWithProvider()
    pageObject.checkCompletionWarningCard(false)
  })
})

When('the facility page is mounted', () => {
  object.mount()
})

Then('the status filter should be shown', () => {
  pageObject.checkStatusFilter(true)
})
