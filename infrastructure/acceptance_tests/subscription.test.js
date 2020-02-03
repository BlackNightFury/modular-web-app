/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
global.WebSocket = require('ws')
const { should, expect } = require('chai')
const shortid = require('shortid')

const {
  generateTestFloorData,
  tenantId,
  TEST_SURVEYOR_EMAIL,
  TEST_PASSWORD,
  configureAmplify,
  configAWSCredential,
} = require('./common-test')

const { listEliasInfo, createFloor, onCreate } = require('./common-graphql')

should()

configureAmplify()

describe('Subscription API Test', () => {
  let eliasInfo
  let facilityId
  const floorId = `TEST_FLOOR_ID_${shortid.generate()}`

  beforeAll(async () => {
    await Auth.signIn(TEST_SURVEYOR_EMAIL, TEST_PASSWORD)
    jest.unmock('aws-sdk')
    await configAWSCredential()
    eliasInfo = await listEliasInfo(tenantId)

    expect(eliasInfo.data.listFacilities.items).to.have.length.above(0)

    facilityId = eliasInfo.data.listFacilities.items[0].id
  }, 50000)

  test('Should get onCreate event when floor added', done => {
    const subscription = onCreate({ facilityId }, err => {
      subscription.unsubscribe()
      expect(err).to.equal(null)
      done()
    })

    setTimeout(() => {
      createFloor(generateTestFloorData(facilityId, floorId))
    }, 3000)
  })

  test('Should have cross-tenant issue on the subscription when user send incorrect tenantId', done => {
    onCreate({ facilityId: 'OTHER_FACILITY_ID' }, err => {
      err.errors[0].message.should.equal('FACILITY_NOT_ALLOWED')
      done()
    })
  })
})
