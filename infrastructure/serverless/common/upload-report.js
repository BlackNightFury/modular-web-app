const AWS = require('aws-sdk')

const uploadReportToS3 = async (body, reportDetails, bucket) => {
  const s3 = new AWS.S3()

  const extension = reportDetails.format.toLowerCase()
  const key = `reports/${reportDetails.type}/${reportDetails.id}/${reportDetails.name}.${extension}`

  const params = {
    Bucket: bucket,
    Key: `public/${key}`,
    Body: body,
    ACL: 'private',
    ContentEncoding: 'utf-8', // required
    ContentType: `text/${extension}`, // required. Notice the back ticks
  }

  let region = 'eu-west-2'
  if (process.env.CONFIG_INFO) {
    const { aws } = JSON.parse(process.env.CONFIG_INFO)
    region = aws.project_region
  }

  await s3.upload(params).promise()

  return {
    bucket,
    region,
    key,
  }
}

module.exports = {
  uploadReportToS3,
}
