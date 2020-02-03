import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import { filterAssetTypeTreeData, getAssetClasses } from '@/services/utils'
import FilterByButton from '@/components/EliasMwaComponents/Host/FilterByButton'
import { mountWithProvider } from '@/../testing/integration/step_definitions/common'
import PageObject from './filterByButton.pageobj'

export default class FilterByButtonTestHelper {
  constructor() {
    this.component = null
    this.filterValues = null
    this.wholeTreeData = [
      {
        title: 'Access',
        value: 'Access-10724-12',
        key: 'Access-10724-12',
        children: [
          {
            title: 'Amplifier',
            value: 'Amplifier-16666-1',
            key: 'Amplifier-16666-1',
            children: [
              {
                title: 'Amplifier',
                value: 'Amplifier-40456',
                key: 'Amplifier-40456',
                virtual: false,
                facets: {
                  Description: [
                    {
                      key: 'Quantity',
                    },
                  ],
                },
              },
            ],
          },
          {
            title: 'Audio Visual Eq',
            value: 'Audio Visual Eq-16667-1',
            key: 'Audio Visual Eq-16667-1',
            children: [
              {
                title: 'Audio Visual Equipment',
                value: 'Audio Visual Equipment-40457',
                key: 'Audio Visual Equipment-40457',
                facets: {
                  Description: [
                    {
                      key: 'Quantity',
                      allowMultiple: true,
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        title: 'Controls',
        value: 'Controls-10726-9',
        key: 'Controls-10726-9',
        children: [
          {
            title: 'Bms',
            value: 'Bms-16692-4',
            key: 'Bms-16692-4',
            children: [
              {
                title: 'Bms - Communications',
                value: 'Bms - Communications-40643',
                key: 'Bms - Communications-40643',
                virtual: true,
                facets: {
                  Description: [
                    {
                      key: 'Quantity',
                      allowMultiple: false,
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ]
    this.mockedProps = {
      treeData: [],
      onFilterKeysChanged: values => {
        this.filterValues = values
        this.mockedProps.filterKeys = values
      },
      setShowFilterState: isFilter => {
        this.mockedProps.showFilter = isFilter
      },
      showFilter: false,
      filterKeys: [],
    }
  }

  calcFilteredTreeDataFromAssetsList() {
    const filteredAssetTypeTreeData = [
      {
        children: filterAssetTypeTreeData(this.wholeTreeData, this.assets),
        key: 'asset-type',
        selectable: false,
        title: 'Asset type',
        value: 'asset-type',
      },
    ]
    filteredAssetTypeTreeData.push(getAssetClasses(filteredAssetTypeTreeData[0].children))
    this.mockedProps.treeData = filteredAssetTypeTreeData
  }

  mockAssetsListWithCoreAndVirtual() {
    this.assets = [
      {
        type: 'Amplifier-40456',
      },
      {
        type: 'Bms - Communications-40643',
      },
    ]
  }

  mockAssetsListWithOnlyCore() {
    this.assets = [
      {
        type: 'Amplifier-40456',
      },
    ]
  }

  mockAssetsList() {
    this.assets = [
      {
        type: 'Amplifier-40456',
      },
    ]
  }

  mockTreeData() {
    this.mockedProps.treeData = [
      {
        key: 'asset-type',
        selectable: false,
        title: 'Asset type',
        value: 'asset-type',
        children: [
          {
            key: 'Access-10724-12',
            selectable: false,
            title: 'Access',
            value: 'Access-10724-12',
          },
        ],
      },
      {
        key: 'asset-class',
        selectable: false,
        title: 'Asset class',
        value: 'asset-class',
        children: [
          {
            title: 'Core',
            key: 'type-core',
            value: 'Class - Core',
            selectable: true,
          },
          {
            title: 'Virtual',
            key: 'type-virtual',
            value: 'Class - Virtual',
            selectable: true,
          },
        ],
      },
    ]
  }

  mountWithProvider() {
    this.component = mountWithProvider(<FilterByButton {...this.mockedProps} />)
  }
}

const object = new FilterByButtonTestHelper()
const pageObject = new PageObject(object)

Given('an assets list with filter option', () => {
  object.mockTreeData()
})

When('the filter renders', () => {
  object.mountWithProvider()
})

Then('the filter icon should be available', () => {
  pageObject.checkFilterIconAvailable()
})

When('I click filter icon', () => {
  pageObject.simulateFilterIconClick()
})

Then('it should change the expanded status of tree select', () => {
  pageObject.checkIfTreeSelectExpanded()
  object.mountWithProvider()
})

When('I change selection with filter input', () => {
  pageObject.simulateAddingFilter()
})

Then('new filter event should be triggered', () => {
  pageObject.checkFilterChangeEvent()
})

When('I add a second filter selection', () => {
  pageObject.simulateAddingSecondFilter()
})

Then('the filter event should include both filters', () => {
  pageObject.checkIncludeBothFilters()
})

Given('an assets list with core & virtual assets', () => {
  object.mockAssetsListWithCoreAndVirtual()
  object.calcFilteredTreeDataFromAssetsList()
})

Then('the filter should include all asset class options', () => {
  pageObject.checkAllAssetsClassAvailable()
})

Given('an assets list with only core assets', () => {
  object.mockAssetsListWithOnlyCore()
  object.calcFilteredTreeDataFromAssetsList()
})

Then('the filter should include only core', () => {
  pageObject.checkOnlyCoreAssetsClassAvailable()
})

Given('an assets list', () => {
  object.mockAssetsList()
  object.calcFilteredTreeDataFromAssetsList()
})

Then('the filter should only include relevent asset types', () => {
  pageObject.checkIncludeOnlyRelevantAssetTypes()
})
