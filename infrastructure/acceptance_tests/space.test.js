/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')
const _ = require('lodash')
const shortid = require('shortid')

const {
  generateTestFloorData,
  generateTestSpaceData,
  generateTestAssetData,
  tenantId,
  TEST_SURVEYOR_EMAIL,
  TEST_PASSWORD,
  configureAmplify,
  configAWSCredential,
} = require('./common-test')

const {
  listEliasInfo,
  listSpaces,
  createFloor,
  createAsset,
  createSpace,
  updateSpace,
  deleteSpace,
  deleteFloor,
} = require('./common-graphql')

should()

configureAmplify()

describe('Space API', () => {
  let eliasInfo
  let facilityId
  let projectId
  let siteId
  const floorId = `TEST_FLOOR_ID_${shortid.generate()}`
  const spaceId = `TEST_SPACE_ID_${shortid.generate()}`

  beforeAll(async () => {
    await Auth.signIn(TEST_SURVEYOR_EMAIL, TEST_PASSWORD)
    jest.unmock('aws-sdk')
    await configAWSCredential()
    eliasInfo = await listEliasInfo(tenantId)

    expect(eliasInfo.data.listFacilities.items).to.have.length.above(0)
    expect(eliasInfo.data.listProjects.items).to.have.length.above(0)

    facilityId = eliasInfo.data.listFacilities.items[0].id
    projectId = eliasInfo.data.listProjects.items[0].id
    siteId = eliasInfo.data.listProjects.items[0].sites[0]

    const result = await createFloor(generateTestFloorData(facilityId, floorId))
    result.data.createFloor.id.should.equal(floorId)
  }, 50000)

  describe('create', () => {
    let result
    beforeAll(async () => {
      result = await createSpace(generateTestSpaceData(facilityId, floorId, spaceId))
    })

    test('should add new created version', () => {
      result.data.createSpace.id.should.equal(spaceId)
    })
  })

  describe('should be able to update space', () => {
    let result
    beforeAll(async () => {
      result = await updateSpace({
        ...generateTestSpaceData(facilityId, floorId, spaceId),
        version: 'v0002',
      })
    })

    test('should add new updated version', () => {
      result.data.updateSpace.currentVersion.should.equal('v0002')
    })
  })

  describe('filter by name', () => {
    let result
    beforeAll(async () => {
      result = await listSpaces(tenantId, facilityId, floorId, `TESTING SPACE${spaceId}`)
    })

    test('should be able to filter by name', () => {
      expect(result.data.listSpaces.items).to.have.length.above(0)
    })
  })

  describe('non destructive delete', () => {
    const assetId = `TEST_ASSET_ID_${shortid.generate()}`
    let result
    let eliasInfoResult
    beforeAll(async () => {
      await createAsset(
        generateTestAssetData(facilityId, floorId, spaceId, projectId, siteId, assetId),
      )
      result = await deleteSpace({
        tenantId,
        facilityId,
        floorId,
        id: spaceId,
        version: 'v0003',
      })
      eliasInfoResult = await listEliasInfo(tenantId)
    })

    test('should add new deleted version', () => {
      _.findIndex(eliasInfoResult.data.listSpaces.items, { id: spaceId }).should.equal(-1)
    })

    test('should update v0000 version', () => {
      result.data.deleteSpace.currentVersion.should.equal('v0003')
    })

    test('should add new deleted version of related assets', () => {
      _.findIndex(eliasInfoResult.data.listAssets.items, { id: assetId }).should.equal(-1)
    })
  })

  afterAll(async () => {
    const result = await deleteFloor({
      tenantId,
      facilityId,
      id: floorId,
      version: 'v0002',
    })
    result.data.deleteFloor.id.should.equal(floorId)
  })
})
