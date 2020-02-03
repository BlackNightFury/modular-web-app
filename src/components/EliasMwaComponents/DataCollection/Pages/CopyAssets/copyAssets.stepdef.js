import { When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { CopyAssetsPage } from '@/components/EliasMwaComponents/DataCollection/Pages/CopyAssets'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import {
  MOCK_COPYVIRTUAL_ASSETS,
  MOCK_TREEDATA,
  MOCK_ASSETS,
  MOCK_SITES,
  MOCK_FACILITIES,
  MOCK_FLOORS,
  MOCK_SPACES,
} from '@/../testing/integration/__mock__/resources'
import PageObject from './copyAssets.pageobj'

export default class CopyAssetsTestHelper {
  constructor() {
    this.component = null
    this.historyLogs = []
    this.historyMock = { push: url => this.historyLogs.push(url) }
    this.mockedProps = {
      facility: {
        id: 'test-facility',
      },
      isCompleted: false,
      isLastFacility: false,
      match: {
        params: {
          facilityName: 'test-facility',
          projectName: 'test-project',
          floorName: 'test-floor',
          spaceName: 'test-space',
        },
      },
      project: {
        preSurveyQuestionnaire: 'basic-pre-survey',
      },
      treeData: MOCK_TREEDATA,
      allRecords: {
        assets: MOCK_ASSETS,
        sites: MOCK_SITES,
        facilities: MOCK_FACILITIES,
        floors: MOCK_FLOORS,
        spaces: MOCK_SPACES,
      },
    }
  }

  mountWithIntl() {
    const { user } = global.store.getState()
    user.assetCopy = { copyAssets: MOCK_COPYVIRTUAL_ASSETS }

    this.component = mountWithIntl(
      <CopyAssetsPage
        {...this.mockedProps}
        user={user}
        dispatch={() => {}}
        history={this.historyMock}
      />,
    )
  }
}

const object = new CopyAssetsTestHelper()
const pageObject = new PageObject(object)

When('I navigate to the copy assets page', () => {
  object.mountWithIntl()
})

Then('the complete copy button should be disabled', () => {
  pageObject.completeBtnDisabledShouldBeAfterUpdate(true)
})

When('I open the virtul asset edit drawer', () => {
  pageObject.openEditAssetDrawer()
})

Then('the virtual assets fields should be editable', () => {
  pageObject.checkVAssetsFieldsEditable()
})
