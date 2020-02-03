import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import { ContextPanel } from '@/components/EliasMwaComponents/DataCollection/Components/ContextPanel'
import PageObject from './contextPanel.pageobj'

export default class ContextPanelTestHelper {
  constructor() {
    this.component = null
    this.mockedProps = {}
  }

  mountWithProvider() {
    this.component = mountWithProvider(<ContextPanel {...this.mockedProps} />)
  }

  mockContextPanelProps() {
    this.mockedProps = {
      project: {
        docs: [],
        name: 'my-project',
        code: '992313',
        preSurveyQuestionnaire: 'basic-pre-survey',
      },
      allRecords: {
        assets: [],
        facilities: [
          {
            docs: [],
            id: 'ABEGCQ8LD',
            name: 'facility 3',
            code: '103243-facility-3',
          },
        ],
        floors: [
          {
            facilityId: 'ABEGCQ8LD',
            id: 'VKewngYJv',
            name: 'Third Floor',
          },
          {
            facilityId: 'ABEGCQ8LD',
            id: 'n81dy6IeH',
            name: 'Second Floor',
          },
        ],
        spaces: [
          {
            facilityId: 'ABEGCQ8LD',
            floorId: 'VKewngYJv',
            id: 'DEHir3ymU',
            name: 'newSpace1',
          },
        ],
      },
      facilitiesInfo: [
        {
          id: 'ABEGCQ8LD',
          key: 'ABEGCQ8LD',
          selectable: true,
          title: 'facility 3',
          code: '103243',
          value: 'ABEGCQ8LD',
          navUrl: '103243-facility-3',
          children: [
            {
              facilityId: 'ABEGCQ8LD',
              id: 'VKewngYJv',
              key: 'VKewngYJv',
              selectable: true,
              title: 'Third Floor',
              value: 'VKewngYJv',
              navUrl: 'VKewngYJv-third-floor',
              children: [
                {
                  floorId: 'VKewngYJv',
                  id: 'DEHir3ymU',
                  key: 'DEHir3ymU',
                  selectable: true,
                  title: 'newSpace1',
                  value: 'DEHir3ymU',
                  navUrl: 'DEHir3ymU-newSpace1',
                },
              ],
            },
            {
              facilityId: 'ABEGCQ8LD',
              id: 'n81dy6IeH',
              key: 'n81dy6IeH',
              selectable: true,
              title: 'Second Floor',
              value: 'n81dy6IeH',
              navUrl: 'n81dy6IeH-second-floor',
            },
          ],
        },
      ],
      isCompleted: false,
      contentAreaNavigation: {
        facility: '103243-facility-3',
        project: '992313-my-project',
      },
      user: {
        favSpaces: [],
      },
    }
  }
}

const object = new ContextPanelTestHelper()
const pageObject = new PageObject(object)

Given('facility with floor and space provided', () => {
  object.mockContextPanelProps()
})

Given('I go to context panel', () => {
  object.mountWithProvider()
})

When('I select a facility on tree menu and click go button', () => {
  pageObject.simulateFacilitySelect()
  pageObject.simulateGoClick()
})

Then('it should navigate to facility page', () => {
  pageObject.checkIfFacilityPage()
})

When('I select a floor on tree menu and click go button', () => {
  pageObject.simulateFloorSelect()
  pageObject.simulateGoClick()
})

Then('it should navigate to floor page', () => {
  pageObject.checkIfFloorPage()
})

When('I select a space on tree menu and click go button', () => {
  pageObject.simulateSpaceSelect()
  pageObject.simulateGoClick()
})

Then('it should navigate to space page', () => {
  pageObject.checkIfSpacePage()
})
