import { Given, When, Then } from 'cucumber'
import AssetFormBuilderTestHelper from './assetFormBuilder.pageobj'

const currentComponent = new AssetFormBuilderTestHelper()

Given('an asset form with asset details', () => {
  currentComponent.mount()
})

When('the condition is changed to CX', () => {
  currentComponent.setCondition(3)
})

Then('the form is submitted', () => {
  currentComponent.submit()
})

Then('the photo validation error should be shown', () => {
  currentComponent.checkPhotoError(true)
})

When('the condition is changed to C', () => {
  currentComponent.setCondition(2)
})

When('the condition is changed to B', () => {
  currentComponent.setCondition(1)
})

Then('the photo validation error should not be shown', () => {
  currentComponent.checkPhotoError(false)
})

When('the Image Restricted is checked', () => {
  currentComponent.checkImageRestricted()
})

Then('the ImageNote validation error should be shown', () => {
  currentComponent.checkImageNoteError(true)
})

When('the ImageNote is filled', () => {
  currentComponent.fillImageNote()
})

Then('the ImageNote validation error should not be shown', () => {
  currentComponent.checkImageNoteError(false)
})
