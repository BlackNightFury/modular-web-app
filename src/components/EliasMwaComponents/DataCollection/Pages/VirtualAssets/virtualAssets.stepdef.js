import { Given, When, Then } from 'cucumber'
import VirtualAssetsTestHelper from './virtualAssets.pageobj'

const currentComponent = new VirtualAssetsTestHelper()

Given('two virtual assets exist', () => {
  currentComponent.setGlobalStore()
  currentComponent.mount()
})

When('I switch to the card view', () => {
  currentComponent.switchCardView()
})

When('I increase the virtual asset quantity', () => {
  currentComponent.increaseVirtualAssetQuantity()
})

Then('It should be ordered correctly', () => {
  currentComponent.checkOrder()
})
