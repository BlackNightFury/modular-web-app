import { When, Then } from 'cucumber'
import UntaggedAssetsTestHelper from './untaggedAssets.pageobj'

const currentComponent = new UntaggedAssetsTestHelper()

When('I go to untagged assets page', () => {
  currentComponent.setGlobalStore()
})

Then('the untagged assets breadcrumb should be shown', () => {
  currentComponent.mountTopBar()
  currentComponent.checkBreadcrumb()
})

When('I filter on Chilled Beams', () => {
  currentComponent.mount()
  currentComponent.changeFilterOption(['Chilled Beams-103224'])
})

Then('the untagged assets list should be filtered by Chilled Beams', () => {
  currentComponent.checkIfFilteredByChilledBeams()
})

When('I sort by Qty', () => {
  currentComponent.changeFilterOption([])
  currentComponent.changeSortOption('facets.quantity')
})

Then('the untagged assets list should be sorted by Qty', () => {
  currentComponent.checkIfSortedByQty()
})
