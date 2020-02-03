const { qaHelper } = require('./task')
const { MOCK_DUPLICATE_ALL_ASSETS } = require('@/../testing/integration/__mock__/resources')

class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = value.toString()
  }

  removeItem(key) {
    delete this.store[key]
  }
}

global.localStorage = new LocalStorageMock()

describe('Check duplicated barcode working', () => {
  it('should get duplicated barcode known issues', () => {
    const asset = {
      facets: { barcode: 'DUPLICATE 1' },
      facilityId: 'FACILITY_ID',
      floorId: 'FLOOR_ID_1',
      spaceId: 'SPACE_ID_1',
      id: 'ASSET_ID_1',
    }
    const assets = MOCK_DUPLICATE_ALL_ASSETS
    qaHelper(asset, assets, false, 'asset')
    const qaIssues = JSON.parse(global.localStorage.getItem('qaIssues'))
    expect(qaIssues).not.toBe(null)
    expect(qaIssues.length).toBe(1)
    expect(qaIssues[0].type).toBe('Duplicate barcode number')
    expect(qaIssues[0].details.length).toBe(2)
  })
})
