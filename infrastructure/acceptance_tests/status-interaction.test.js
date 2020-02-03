/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')
const shortid = require('shortid')

const {
  generateTestProjectData,
  generateTestFacilityData,
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
  createProject,
  createFloor,
  createFacility,
  createAsset,
  createSpace,
  listSpaces,
  listFloors,
  listFacilities,
  updateSpace,
  updateFacility,
  updateFloor,
} = require('./common-graphql')

should()

configureAmplify()

describe('Asset Appsync API', () => {
  let facilityId
  let projectId
  let siteId

  beforeAll(async () => {
    await Auth.signIn(TEST_SURVEYOR_EMAIL, TEST_PASSWORD)
    jest.unmock('aws-sdk')
    await configAWSCredential()

    facilityId = shortid.generate()
    projectId = shortid.generate()
    siteId = shortid.generate()

    await createProject(generateTestProjectData(projectId, [siteId]))
    await createFacility(generateTestFacilityData(facilityId, siteId, 'NOT_STARTED'))
  })

  describe('facility status', () => {
    let floorId

    beforeEach(() => {
      facilityId = `TEST_FACILITY_ID_${shortid.generate()}`
      floorId = `TEST_FLOOR_ID_${shortid.generate()}`
    })

    test('should be in progress if its status was NOT_STARTED when a floor is added', async () => {
      await createFacility(generateTestFacilityData(facilityId, siteId, 'NOT_STARTED'))
      await createFloor(generateTestFloorData(facilityId, floorId, 'NOT_STARTED'))
      const facilities = await listFacilities(tenantId)
      const targetFacility = facilities.data.listFacilities.items.find(
        facility => facility.id === facilityId,
      )
      targetFacility.status.should.equal('IN_PROGRESS')
    })

    test('should be in progress if its status was DONE when a floor is added', async () => {
      await createFacility(generateTestFacilityData(facilityId, siteId, 'DONE'))
      await createFloor(generateTestFloorData(facilityId, floorId, 'NOT_STARTED'))
      const facilities = await listFacilities(tenantId)
      const targetFacility = facilities.data.listFacilities.items.find(
        facility => facility.id === facilityId,
      )
      targetFacility.status.should.equal('IN_PROGRESS')
    })

    test('should be in progress if its status was DONE when a floor is updated to any status except done', async () => {
      await createFacility(generateTestFacilityData(facilityId, siteId, 'DONE'))
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      await updateFacility({
        ...generateTestFacilityData(facilityId, siteId, 'DONE'),
        version: 'v0002',
      })
      await updateFloor({
        ...generateTestFloorData(facilityId, floorId, 'IN_PROGRESS'),
        version: 'v0002',
      })
      const facilities = await listFacilities(tenantId)
      const targetFacility = facilities.data.listFacilities.items.find(
        facility => facility.id === facilityId,
      )
      targetFacility.status.should.equal('IN_PROGRESS')
    })

    test('should not move to in progress if its status was DONE when a floor is updated to done', async () => {
      await createFacility(generateTestFacilityData(facilityId, siteId, 'DONE'))
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      await updateFacility({
        ...generateTestFacilityData(facilityId, siteId, 'DONE'),
        version: 'v0002',
      })
      await updateFloor({
        ...generateTestFloorData(facilityId, floorId, 'DONE'),
        version: 'v0002',
      })
      const facilities = await listFacilities(tenantId)
      const targetFacility = facilities.data.listFacilities.items.find(
        facility => facility.id === facilityId,
      )
      targetFacility.status.should.equal('DONE')
    })
  })

  describe('floor status', () => {
    let floorId
    let spaceId

    beforeEach(() => {
      floorId = `TEST_FLOOR_ID_${shortid.generate()}`
      spaceId = `TEST_SPACE_ID_${shortid.generate()}`
    })

    test('should be in progress if its status was NOT_STARTED when a space is added', async () => {
      await createFloor(generateTestFloorData(facilityId, floorId, 'NOT_STARTED'))
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId, 'NOT_STARTED'))
      const floors = await listFloors(tenantId, facilityId)
      const targetFloor = floors.data.listFloors.items.find(floor => floor.id === floorId)
      targetFloor.status.should.equal('IN_PROGRESS')
    })

    test('should be in progress if its status was DONE when a space is added', async () => {
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId, 'DONE'))
      const floors = await listFloors(tenantId, facilityId)
      const targetFloor = floors.data.listFloors.items.find(floor => floor.id === floorId)
      targetFloor.status.should.equal('IN_PROGRESS')
    })

    test('should be in progress if its status was DONE when a space is updated to any status except done', async () => {
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId, 'DONE'))
      await updateSpace({
        ...generateTestSpaceData(facilityId, floorId, spaceId),
        status: 'NOT_STARTED',
        version: 'v0002',
      })
      const floors = await listFloors(tenantId, facilityId)
      const targetFloor = floors.data.listFloors.items.find(floor => floor.id === floorId)
      targetFloor.status.should.equal('IN_PROGRESS')
    })

    test('should not move to in progress if its status was DONE when a space is updated to done', async () => {
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId, 'NOT_STARTED'))
      await updateFloor({
        ...generateTestFloorData(facilityId, floorId),
        status: 'DONE',
        version: 'v0002',
      })
      await updateSpace({
        ...generateTestSpaceData(facilityId, floorId, spaceId),
        status: 'DONE',
        version: 'v0002',
      })
      const floors = await listFloors(tenantId, facilityId)
      const targetFloor = floors.data.listFloors.items.find(floor => floor.id === floorId)
      targetFloor.status.should.equal('DONE')
    })
  })

  describe('facility floor and space status', () => {
    let floorId
    let spaceId
    let assetId

    beforeEach(() => {
      facilityId = `TEST_FACILITY_ID_${shortid.generate()}`
      floorId = `TEST_FLOOR_ID_${shortid.generate()}`
      spaceId = `TEST_SPACE_ID_${shortid.generate()}`
      assetId = `TEST_ASSET_ID_${shortid.generate()}`
    })

    test('should be in progress if their status was NOT_STARTED when an asset is added', async () => {
      await createFacility(generateTestFacilityData(facilityId, siteId, 'NOT_STARTED'))
      await createFloor(generateTestFloorData(facilityId, floorId, 'NOT_STARTED'))
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId, 'NOT_STARTED'))
      await updateFloor({
        ...generateTestFloorData(facilityId, floorId),
        status: 'NOT_STARTED',
        version: 'v0002',
      })
      await updateFacility({
        ...generateTestFacilityData(facilityId, siteId, 'NOT_STARTED'),
        version: 'v0002',
      })
      await createAsset(
        generateTestAssetData(facilityId, floorId, spaceId, projectId, siteId, assetId),
      )
      const facilities = await listFacilities(tenantId)
      const targetFacility = facilities.data.listFacilities.items.find(
        facility => facility.id === facilityId,
      )
      targetFacility.status.should.equal('IN_PROGRESS')
      const floors = await listFloors(tenantId, facilityId)
      const targetFloor = floors.data.listFloors.items.find(floor => floor.id === floorId)
      targetFloor.status.should.equal('IN_PROGRESS')
      const spaces = await listSpaces(tenantId, facilityId, floorId)
      const targetSpace = spaces.data.listSpaces.items.find(space => space.id === spaceId)
      targetSpace.status.should.equal('IN_PROGRESS')
    })

    test('should be in progress if their status was DONE when an asset is added', async () => {
      await createFacility(generateTestFacilityData(facilityId, siteId, 'DONE'))
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId, 'DONE'))
      await updateFloor({
        ...generateTestFloorData(facilityId, floorId, 'DONE'),
        version: 'v0002',
      })
      await updateFacility({
        ...generateTestFacilityData(facilityId, siteId, 'DONE'),
        version: 'v0002',
      })
      await createAsset(
        generateTestAssetData(facilityId, floorId, spaceId, projectId, siteId, assetId),
      )
      const facilities = await listFacilities(tenantId)
      const targetFacility = facilities.data.listFacilities.items.find(
        facility => facility.id === facilityId,
      )
      targetFacility.status.should.equal('IN_PROGRESS')
      const floors = await listFloors(tenantId, facilityId)
      const targetFloor = floors.data.listFloors.items.find(floor => floor.id === floorId)
      targetFloor.status.should.equal('IN_PROGRESS')
      const spaces = await listSpaces(tenantId, facilityId, floorId)
      const targetSpace = spaces.data.listSpaces.items.find(space => space.id === spaceId)
      targetSpace.status.should.equal('IN_PROGRESS')
    })
  })

  describe('floor and space completed field', () => {
    let floorId
    let spaceId

    beforeEach(() => {
      floorId = `TEST_FLOOR_ID_${shortid.generate()}`
      spaceId = `TEST_SPACE_ID_${shortid.generate()}`
    })

    test('floor completed field should be empty if its status become from DONE to NOT_STARTED', async () => {
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      const updatedFloor = await updateFloor({
        ...generateTestFloorData(facilityId, floorId),
        status: 'NOT_STARTED',
        version: 'v0002',
      })
      expect(updatedFloor.data.updateFloor.completedAt).to.equal(null)
    })

    test('space completed field should be empty if its status become from DONE to NOT_STARTED', async () => {
      await createFloor(generateTestFloorData(facilityId, floorId, 'DONE'))
      await createSpace(generateTestSpaceData(facilityId, floorId, spaceId, 'DONE'))
      const updatedSpace = await updateSpace({
        ...generateTestSpaceData(facilityId, floorId, spaceId),
        status: 'NOT_STARTED',
        version: 'v0002',
      })
      expect(updatedSpace.data.updateSpace.completedAt).to.equal(null)
    })
  })
})
