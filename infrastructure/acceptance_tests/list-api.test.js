/**
 * @jest-environment node
 */
const { Auth } = require('aws-amplify')
global.fetch = require('node-fetch')
const { should, expect } = require('chai')
const shortid = require('shortid')
const {
  listProjectIDsQuery,
  listAssetIDsQuery,
  listFacilityIDsQuery,
  listFloorIDsQuery,
  listSpaceIDsQuery,
  listSiteIDsQuery,
} = require('./queries')

const {
  generateTestSiteData,
  generateTestFloorData,
  generateTestSpaceData,
  generateTestAssetData,
  tenantId,
  otherTenantId,
  TEST_SURVEYOR_EMAIL,
  TEST_PASSWORD,
  configureAmplify,
  configAWSCredential,
} = require('./common-test')

const {
  listEliasInfo,
  invokeListGql,
  createSite,
  createFloor,
  createAsset,
  createSpace,
} = require('./common-graphql')

should()

configureAmplify()

describe('List APIs', () => {
  let eliasInfo
  let facilityId
  let projectId
  let siteId
  const floorId = `TEST_FLOOR_ID_${shortid.generate()}`
  const spaceId = `TEST_SPACE_ID_${shortid.generate()}`
  const assetId = `TEST_ASSET_ID_${shortid.generate()}`
  const newSiteId = `TEST_SITE_ID_${shortid.generate()}`

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

  test('Should be able to get fields of projects specified by client', async () => {
    const projects = await invokeListGql(listProjectIDsQuery, tenantId, ['id'])
    expect(projects.data.listProjects.items).to.have.length.above(0)
    expect(Object.keys(projects.data.listProjects.items[0]).length).to.equal(1)
    expect(projects.data.listProjects.items[0].id).to.exist //eslint-disable-line
  })

  test('Should be able to get fields of facilities specified by client', async () => {
    const facilities = await invokeListGql(listFacilityIDsQuery, tenantId, ['id'])
    expect(facilities.data.listFacilities.items).to.have.length.above(0)
    expect(Object.keys(facilities.data.listFacilities.items[0]).length).to.equal(1)
    expect(facilities.data.listFacilities.items[0].id).to.exist //eslint-disable-line
  })

  test('Should be able to get fields of sites specified by client', async () => {
    await createSite(generateTestSiteData(newSiteId))
    const sites = await invokeListGql(listSiteIDsQuery, tenantId, ['id'])
    expect(sites.data.listSites.items).to.have.length.above(0)
    expect(Object.keys(sites.data.listSites.items[0]).length).to.equal(1)
    expect(sites.data.listSites.items[0].id).to.exist //eslint-disable-line
  })

  test('Should be able to get fields of floors specified by client', async () => {
    await createFloor(generateTestFloorData(facilityId, floorId))
    const floors = await invokeListGql(listFloorIDsQuery, tenantId, ['id'])
    expect(floors.data.listFloors.items).to.have.length.above(0)
    expect(Object.keys(floors.data.listFloors.items[0]).length).to.equal(1)
    expect(floors.data.listFloors.items[0].id).to.exist //eslint-disable-line
  })

  test('Should be able to get fields of spaces specified by client', async () => {
    await createSpace(generateTestSpaceData(facilityId, floorId, spaceId))
    const spaces = await invokeListGql(listSpaceIDsQuery, tenantId, ['id'])
    expect(spaces.data.listSpaces.items).to.have.length.above(0)
    expect(Object.keys(spaces.data.listSpaces.items[0]).length).to.equal(1)
    expect(spaces.data.listSpaces.items[0].id).to.exist //eslint-disable-line
  })

  test('Should be able to get fields of assets specified by client', async () => {
    await createAsset(
      generateTestAssetData(facilityId, floorId, spaceId, projectId, siteId, assetId),
    )
    const assets = await invokeListGql(listAssetIDsQuery, tenantId, ['id', 'assetType', 'spons'])
    expect(assets.data.listAssets.items).to.have.length.above(0)
    expect(Object.keys(assets.data.listAssets.items[0]).length).to.equal(3)
    expect(assets.data.listAssets.items[0].id).to.exist //eslint-disable-line
    expect(assets.data.listAssets.items[0].spons.lifecycle).to.exist //eslint-disable-line
    expect(assets.data.listAssets.items[0].spons.replacementCost).to.exist //eslint-disable-line
    expect(assets.data.listAssets.items[0].spons.totalReplacementCost).to.exist //eslint-disable-line
  })
})

describe('API tenant restrictions', () => {
  test('Should prevent cross tenant access', async () => {
    try {
      await listEliasInfo(otherTenantId)
      expect.fail("Shouldn't get other tenants information")
    } catch (err) {
      err.errors[0].message.should.equal('TENANT_ACCESS_DENIED')
    }
  })
})
