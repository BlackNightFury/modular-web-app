const AWS = require('aws-sdk')
const sharp = require('sharp')

const getThumbnail = async original => {
  // Generating thumbnail
  const sharpedImage = sharp(original)
  // eslint-disable-next-line
  const metaData = await sharpedImage.metadata()
  const { width, height } = metaData

  let thumbnailData
  if (width > height) {
    // eslint-disable-next-line
    thumbnailData = await sharpedImage.resize(350).toBuffer()
  } else {
    // eslint-disable-next-line
    thumbnailData = await sharpedImage.resize(undefined, 350).toBuffer()
  }

  return thumbnailData
}

const uploadImages = async (input, isUpdate) => {
  if (!input.images) return

  const s3 = new AWS.S3()

  const purifiedInput = input.images || []
  for (let i = 0; i < purifiedInput.length; i += 1) {
    const asset = purifiedInput[i]
    if (isUpdate && (!asset.dataUri || asset.dataUri.startsWith('blob'))) {
      // eslint-disable-next-line
      continue
    }
    const base64Data = new Buffer.from(
      asset.dataUri.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    )

    // eslint-disable-next-line
    const thumbnailData = await getThumbnail(base64Data)

    // Getting the file type, ie: jpeg, png or gif
    const type = asset.dataUri.split(';')[0].split('/')[1]
    const fileName = asset.picture.key.split('.')[0]

    const thumbnailParams = {
      Bucket: asset.picture.bucket,
      Key: `public/${input.id}/${asset.picture.key}`,
      Body: thumbnailData,
      ACL: 'private',
      ContentEncoding: 'base64', // required
      ContentType: `image/${type}`, // required. Notice the back ticks
    }

    const fullParams = {
      Bucket: asset.picture.bucket,
      Key: `public/${input.id}/${fileName}.full.${type}`,
      Body: base64Data,
      ACL: 'private',
      ContentEncoding: 'base64', // required
      ContentType: `image/${type}`, // required. Notice the back ticks
    }

    // eslint-disable-next-line
    delete asset['dataUri']

    // eslint-disable-next-line
    await s3.upload(thumbnailParams).promise()
    // eslint-disable-next-line
    await s3.upload(fullParams).promise()
    asset.picture.key = `${input.id}/${asset.picture.key}`
  }
}

module.exports = {
  getThumbnail,
  uploadImages,
}
