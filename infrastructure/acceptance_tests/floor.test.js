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
  generateInaccessibleTestSpaceData,
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
  updateFloor,
  deleteSpace,
  deleteFloor,
} = require('./common-graphql')

should()

configureAmplify()

describe('Floor API', () => {
  let eliasInfo
  let facilityId
  let projectId
  let siteId
  const floorId = `TEST_FLOOR_ID_${shortid.generate()}`
  let spaceId = `TEST_SPACE_ID_${shortid.generate()}`

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
  }, 50000)

  describe('create', () => {
    let result
    beforeAll(async () => {
      result = await createFloor(generateTestFloorData(facilityId, floorId))
    })

    test('should add new created version', () => {
      result.data.createFloor.id.should.equal(floorId)
    })
  })

  describe('update', () => {
    let result
    beforeAll(async () => {
      result = await updateFloor({
        ...generateTestFloorData(facilityId, floorId),
        version: 'v0002',
      })
    })

    test('should add new updated version', () => {
      result.data.updateFloor.currentVersion.should.equal('v0002')
    })

    test('should not allow to update floor with setting isDeleted property', async () => {
      try {
        await updateFloor({
          ...generateTestFloorData(facilityId, floorId),
          isDeleted: true,
          version: 'v0003',
        })
      } catch (err) {
        err.errors[0].message.should.equal(
          "The variables input contains a field name 'isDeleted' that is not defined for input object type 'UpdateFloorInput' ",
        )
      }
    })
  })

  describe('complete', () => {
    let result
    let spaces
    beforeAll(async () => {
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId))
      await createSpace(generateInaccessibleTestSpaceData(facilityId, floorId, spaceId))
      result = await updateFloor({
        ...generateTestFloorData(facilityId, floorId),
        status: 'DONE',
        version: 'v0003',
      })
      spaces = await listSpaces(tenantId, facilityId, floorId)
    })

    test('status should be done', () => {
      result.data.updateFloor.status.should.equal('DONE')
    })

    test(`related spaces' status should be done but inaccessible spaces' status shouldn't be changed`, () => {
      spaces.data.listSpaces.items.forEach(space => {
        if (space.availableDate) {
          space.status.should.equal('INACCESSIBLE')  
        } else {
          space.status.should.equal('DONE')
        }
      })
    })

    afterAll(async () => {
      await deleteSpace({
        tenantId,
        facilityId,
        floorId,
        id: spaceId,
        version: 'v0003',
      })
    })
  })

  describe('non destructive delete', () => {
    spaceId = `TEST_SPACE_ID_${shortid.generate()}`
    const assetId = `TEST_ASSET_ID_${shortid.generate()}`
    let result
    let eliasInfoResult
    beforeAll(async () => {
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId))
      await createAsset(
        generateTestAssetData(facilityId, floorId, spaceId, projectId, siteId, assetId),
      )

      result = await deleteFloor({
        tenantId,
        facilityId,
        id: floorId,
        version: 'v0004',
      })
      eliasInfoResult = await listEliasInfo(tenantId)
    })

    test('should add new deleted version', () => {
      _.findIndex(eliasInfoResult.data.listFloors.items, { id: floorId }).should.equal(-1)
    })

    test('should update v0000 version', () => {
      result.data.deleteFloor.currentVersion.should.equal('v0004')
    })

    test('should add new deleted version of related spaces', () => {
      _.findIndex(eliasInfoResult.data.listSpaces.items, { id: spaceId }).should.equal(-1)
    })

    test('should add new deleted version of related assets', () => {
      _.findIndex(eliasInfoResult.data.listAssets.items, { id: assetId }).should.equal(-1)
    })
  })
})
