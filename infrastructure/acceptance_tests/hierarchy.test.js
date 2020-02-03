/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')

const { TEST_SURVEYOR_EMAIL, TEST_PASSWORD, configureAmplify } = require('./common-test')

const { getAssetsHierarchy } = require('./common-graphql')

should()

configureAmplify()

describe('Hierarchy API', () => {
  beforeAll(async () => {
    await Auth.signIn(TEST_SURVEYOR_EMAIL, TEST_PASSWORD)
  }, 50000)

  describe('getAssetsHierarchy', () => {
    const projectId = 173
    const tenantId = '672FB50-BE2B-405D-9526-CB81427B7B7E'

    test('should return result', async () => {
      const result = await getAssetsHierarchy([
        {
          projectId,
          tenantId,
        },
      ])
      // console.log('result', result)
      const data = JSON.parse(result.data.getHierarchy)
      const { hierarchy, manufacturers } = data['173']

      const resTenantId = data['173'].tenantId

      expect(hierarchy).to.have.length.above(0)
      expect(manufacturers).to.have.length.above(0)
      expect(resTenantId).to.eql(tenantId)
    })
  })
})
