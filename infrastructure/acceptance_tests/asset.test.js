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
  createFloor,
  createAsset,
  createSpace,
  updateAsset,
  deleteAsset,
  deleteSpace,
  deleteFloor,
} = require('./common-graphql')

should()

configureAmplify()

describe('Asset API', () => {
  let eliasInfo
  let facilityId
  let projectId
  let siteId
  const floorId = `TEST_FLOOR_ID_${shortid.generate()}`
  const spaceId = `TEST_SPACE_ID_${shortid.generate()}`
  const assetId = `TEST_ASSET_ID_${shortid.generate()}`

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

    const result1 = await createFloor(generateTestFloorData(facilityId, floorId))
    result1.data.createFloor.id.should.equal(floorId)

    const result2 = await createSpace(generateTestSpaceData(facilityId, floorId, spaceId))
    result2.data.createSpace.id.should.equal(spaceId)
  }, 50000)

  describe('create', () => {
    let result
    beforeAll(async () => {
      result = await createAsset(
        generateTestAssetData(facilityId, floorId, spaceId, projectId, siteId, assetId),
      )
    })

    test('should add new created version', () => {
      result.data.createAsset.id.should.equal(assetId)
    })
  })

  describe('update', () => {
    let result
    beforeAll(async () => {
      result = await updateAsset({
        ...generateTestAssetData(facilityId, floorId, spaceId, projectId, siteId, assetId),
        version: 'v0002',
      })
    })

    test('should add new updated version', () => {
      result.data.updateAsset.currentVersion.should.equal('v0002')
    })
  })

  describe('non destructive delete', () => {
    let result
    let eliasInfoResult
    beforeAll(async () => {
      result = await deleteAsset({
        tenantId,
        facilityId,
        floorId,
        spaceId,
        id: assetId,
        version: 'v0003',
      })
      eliasInfoResult = await listEliasInfo(tenantId)
    })

    test('should add new deleted version', () => {
      _.findIndex(eliasInfoResult.data.listAssets.items, { id: assetId }).should.equal(-1)
    })

    test('should update v0000 version', () => {
      result.data.deleteAsset.currentVersion.should.equal('v0003')
    })
  })

  afterAll(async () => {
    const result1 = await deleteFloor({
      tenantId,
      facilityId,
      id: floorId,
      version: 'v0002',
    })
    result1.data.deleteFloor.id.should.equal(floorId)

    const result2 = await deleteSpace({
      tenantId,
      facilityId,
      floorId,
      id: spaceId,
      version: 'v0002',
    })
    result2.data.deleteSpace.id.should.equal(spaceId)
  })
})
