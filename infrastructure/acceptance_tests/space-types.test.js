/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')
// const _ = require('lodash')
// const shortid = require('shortid')

const {
  TEST_SURVEYOR_EMAIL,
  TEST_PASSWORD,
  configureAmplify,
} = require('./common-test')

const {
  getSpaceTypes,
} = require('./common-graphql')

should()

configureAmplify()

describe('Space Types API', () => {
  beforeAll(async () => {
    await Auth.signIn(TEST_SURVEYOR_EMAIL, TEST_PASSWORD)
  }, 50000)

  describe('getSpaceTypes', () => {
    
    test('should return result', async () => {
      const result = await getSpaceTypes([173])
      console.log(result)
      const spaceTypes = JSON.parse(result.data.getSpaceTypes)
      expect(spaceTypes[173]).to.have.length.above(0)
    })
  })

})
