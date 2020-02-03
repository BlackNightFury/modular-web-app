const { expect } = require('chai')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')
const { getThumbnail } = require('./image')

jest.mock('aws-sdk', () => ({
  config: {
    update: () => {},
  },
  S3: {
    upload: params => params,
  },
}))

describe('thumbnail generation', () => {
  it('with longer width', async () => {
    // read binary data
    const bitmap = fs.readFileSync(
      path.resolve(__dirname, './mockdata/images/image_longer_width.jpeg'),
    )
    // convert binary data to base64 encoded string
    const bufferBmp = new Buffer.from(bitmap)
    const thumbnail = await getThumbnail(bufferBmp)
    const metadata = await sharp(thumbnail).metadata()
    expect(expect(metadata.width).to.eql(350))
  })

  it('with longer height', async () => {
    // read binary data
    const bitmap = fs.readFileSync(
      path.resolve(__dirname, './mockdata/images/image_longer_height.jpeg'),
    )
    // convert binary data to base64 encoded string
    const bufferBmp = new Buffer.from(bitmap)
    const thumbnail = await getThumbnail(bufferBmp)
    const metadata = await sharp(thumbnail).metadata()
    expect(expect(metadata.height).to.eql(350))
  })
})
