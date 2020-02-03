import { Given, When, Then } from 'cucumber'
import 'ignore-styles'
import React from 'react'
import PhotoTaker from '@/components/EliasMwaComponents/DataCollection/Components/PhotoTaker'
import { mountWithIntl } from '@/../testing/integration/step_definitions/common/intl-config'
import PageObject from './photoTaker.pageobj'

export default class PhotoTakerTestHelper {
  constructor() {
    this.component = null
    this.samplePhoto =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
    this.mockedProps = {
      authUser: {},
      onChange: () => {},
      onDelete: () => {
        this.deletedPhoto = true
      },
      photos: [],
      readOnly: false,
    }
    this.deletedPhoto = false
  }

  mountWithIntl() {
    this.component = mountWithIntl(<PhotoTaker {...this.mockedProps} />)
  }

  mockOneImage() {
    this.mockedProps.photos = [this.samplePhoto]
  }

  mockMaxNumberOfImages() {
    this.mockedProps.photos = Array(5)
      .fill(this.samplePhoto)
      .map((item, idx) => ({
        ...item,
        id: idx.toString(),
      }))
  }
}

const object = new PhotoTakerTestHelper()
const pageObject = new PageObject(object)

Given('I am navigated to phototaker component with one image', () => {
  object.mockOneImage()
  object.mountWithIntl()
})

Given('I am navigated to phototaker component with 5 images', () => {
  object.mockMaxNumberOfImages()
  object.mountWithIntl()
})

When('I click add button', () => {
  pageObject.clickAddButton()
})

Then('it should show maximum number of image validation message', () => {
  pageObject.checkMaxNumberImageValidation()
})

When('I click delete button', () => {
  pageObject.clickDeleteButton()
})

Then('it should show delete confirmation message', () => {
  pageObject.checkDeleteConfirmMsg()
})

When('I click confirmation button', () => {
  pageObject.clickDeleteConfirmBtn()
})

Then('it should delete current image', () => {
  pageObject.checkImageDeletion()
})
