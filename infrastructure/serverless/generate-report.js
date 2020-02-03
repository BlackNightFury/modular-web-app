const { DataTransform } = require('node-json-transform')
const defaultMiddleware = require('./middleware/index').default
const { getDataSourceForAssetManagement } = require('./common/get-data-source-report')
const { reportAttributeMappings, reportAttributes } = require('./common/report-attribute-mappings')
const { uploadReportToS3 } = require('./common/upload-report')
const { getFormattedData } = require('./common/get-formated-data')

const getReportDataSource = async event => {
  const {
    filters,
    reportDetails: { type },
    esIndex,
    environment,
  } = event
  try {
    switch (type) {
      case 'ASSET_MANAGEMENT_CAFM_EXPORT':
        return await getDataSourceForAssetManagement(filters, esIndex, environment)
      default:
        throw new Error('Not supported report type')
    }
  } catch (err) {
    throw err
  }
}

const generateReport = async event => {
  try {
    const {
      reportDetails,
      reportDetails: { type, format },
      tenantInfo: { assetImagesS3Bucket },
    } = event
    const dataSource = await getReportDataSource(event)
    const dataTransform = DataTransform(
      {
        dataSource,
      },
      reportAttributeMappings[type],
    )

    const transformedData = dataTransform.transform()

    const report = await uploadReportToS3(
      getFormattedData(transformedData, format, reportAttributes[type]),
      reportDetails,
      assetImagesS3Bucket,
    )
    return {
      reportDetails,
      report,
    }
  } catch (err) {
    throw err
  }
}

module.exports.generateReport = generateReport
module.exports.lambda = defaultMiddleware(generateReport, {
  role: 'generate-report',
  idLocation: 'filters',
})
