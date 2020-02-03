/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')
const shortid = require('shortid')

const {
  tenantId,
  TEST_CUSTOMER_EMAIL,
  TEST_PASSWORD,
  configureAmplify,
  configAWSCredential,
} = require('./common-test')

const { generateReport } = require('./common-graphql')

should()

configureAmplify()

describe('Genereate report API', () => {
  beforeAll(async () => {
    await Auth.signIn(TEST_CUSTOMER_EMAIL, TEST_PASSWORD)
    jest.unmock('aws-sdk')
    await configAWSCredential()
  })

  test('should be able to generate CAFM export for asset management', async () => {
    const result = await generateReport(
      {
        assetType: {
          trees: [['Non_Supported', 'Non_Supported', 'Non_Supported']],
          class: 'ALL',
        },
        tenantId,
      },
      {
        id: shortid.generate(),
        type: 'ASSET_MANAGEMENT_CAFM_EXPORT',
        name: 'test_report',
        format: 'CSV',
      },
    )
    expect(result.data).not.be.an('undefined')
  })

  test('should not be able to generate unsupported type of export', async () => {
    try {
      await generateReport(
        {
          assetType: {
            trees: [['Non_Supported', 'Non_Supported', 'Non_Supported']],
            class: 'ALL',
          },
          tenantId,
        },
        {
          id: shortid.generate(),
          type: 'UNSUPPORTED_TYPE',
          name: 'test_report',
          format: 'CSV',
        },
      )
    } catch (err) {
      expect(err).not.be.an('undefined')
    }
  })

  test('should not be able to generate unsupported format of export', async () => {
    try {
      await generateReport(
        {
          assetType: {
            trees: [['Non_Supported', 'Non_Supported', 'Non_Supported']],
            class: 'ALL',
          },
          tenantId,
        },
        {
          id: shortid.generate(),
          type: 'ASSET_MANAGEMENT_CAFM_EXPORT',
          name: 'test_report',
          format: 'UNSUPPORTED_FORMAT',
        },
      )
    } catch (err) {
      expect(err).not.be.an('undefined')
    }
  })
})
