/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')
const shortid = require('shortid')

const {
  generateTestFacilityData,
  tenantId,
  TEST_SURVEYOR_EMAIL,
  TEST_PASSWORD,
  configureAmplify,
  configAWSCredential,
} = require('./common-test')

const { listEliasInfo, createFacility, updateFacility } = require('./common-graphql')

should()

configureAmplify()

describe('Facility API', () => {
  let eliasInfo
  const facilityId = `TEST_FACILITY_ID_${shortid.generate()}`
  const siteId = shortid.generate()
  beforeAll(async () => {
    await Auth.signIn(TEST_SURVEYOR_EMAIL, TEST_PASSWORD)
    jest.unmock('aws-sdk')
    await configAWSCredential()
    eliasInfo = await listEliasInfo(tenantId)

    expect(eliasInfo.data.listFacilities.items).to.have.length.above(0)
    expect(eliasInfo.data.listProjects.items).to.have.length.above(0)
  }, 50000)
  describe('create', async () => {
    let result
    beforeAll(async () => {
      result = await createFacility(generateTestFacilityData(facilityId, siteId, 'NOT_STARTED'))
    })
    test('should add new created version', () => {
      result.data.createFacility.id.should.equal(facilityId)
    })
  })

  describe('update', async () => {
    let result
    beforeAll(async () => {
      result = await updateFacility({
        ...generateTestFacilityData(facilityId, siteId, 'NOT_STARTED'),
        version: 'v0002',
      })
    })

    test('should add new updated version', () => {
      result.data.updateFacility.currentVersion.should.equal('v0002')
    })

    test('should be able to update floor with image', async () => {
      result = await updateFacility({
        ...generateTestFacilityData(facilityId, siteId, 'NOT_STARTED', true),
        version: 'v0003',
      })
      result.data.updateFacility.currentVersion.should.equal('v0003')
    })
  })
})
