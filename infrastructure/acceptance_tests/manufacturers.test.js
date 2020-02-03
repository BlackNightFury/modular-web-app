/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')
// const _ = require('lodash')
// const shortid = require('shortid')

const {
  // generateTestFloorData,
  // generateTestSpaceData,
  // generateTestAssetData,
  TEST_SURVEYOR_EMAIL,
  TEST_PASSWORD,
  configureAmplify,
} = require('./common-test')

const {
  getManufacturers,
} = require('./common-graphql')

should()

configureAmplify()

describe('Manufacturers API', () => {
  beforeAll(async () => {
    await Auth.signIn(TEST_SURVEYOR_EMAIL, TEST_PASSWORD)
  }, 50000)

  describe('getManufacturers', () => {
    
    test('should return result', async () => {
      const result = await getManufacturers()
      const manufacturers = JSON.parse(result.data.getManufacturers)
      expect(manufacturers.manufacturers).to.have.length.above(0)
    })
  })

})
