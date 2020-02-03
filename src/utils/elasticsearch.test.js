const Amplify = require('@aws-amplify/core').default
const Auth = require('@aws-amplify/auth').default
global.fetch = require('node-fetch')
const {
  simplifyConditionByFacilityAssetsAggregation,
  getAllAssets,
  filterKeysToESQuery,
} = require('./elasticsearch')
const { loadConfig } = require('../../scripts/get-config')

const mockedRawAggregaion = {
  aggregations: {
    facilities: {
      buckets: [
        {
          doc_count: 2,
          key: 'facility-1',
          conditions: {
            buckets: [{ key: 'A', doc_count: 1 }, { key: 'B', doc_count: 1 }],
          },
          facilityName: {
            buckets: [{ key: 'facilityName1', doc_count: 1 }, { key: 'B', doc_count: 1 }],
          },
        },
        {
          doc_count: 2,
          key: 'facility-2',
          conditions: {
            buckets: [{ key: 'B', doc_count: 1 }, { key: 'D', doc_count: 1 }],
          },
          facilityName: {
            buckets: [{ key: 'facilityName2', doc_count: 1 }, { key: 'B', doc_count: 1 }],
          },
        },
      ],
    },
  },
}

const simplifiedResult = simplifyConditionByFacilityAssetsAggregation(mockedRawAggregaion)

describe('conditions fetch check', () => {
  it('should return correct conditions', () => {
    expect(simplifiedResult.conditions.indexOf('A') !== -1).toBe(true)
    expect(simplifiedResult.conditions.indexOf('B') !== -1).toBe(true)
    expect(simplifiedResult.conditions.indexOf('C') !== -1).toBe(false)
    expect(simplifiedResult.conditions.indexOf('D') !== -1).toBe(true)
  })
})

describe('facilityIds fetch check', () => {
  it('should return correct facility ids', () => {
    expect(simplifiedResult.facilityNames[0]).toBe('facilityName1')
    expect(simplifiedResult.facilityNames[1]).toBe('facilityName2')
  })
})

describe('filterKeys to es query check', () => {
  it('should return ES query if filter is asset type', () => {
    const query = filterKeysToESQuery({
      assetType: {
        class: 'VIRTUAL',
        trees: [['A1', 'B1', 'C1'], ['A2', 'B2', 'C2']],
      },
    })
    expect(query.must.length).toBe(1)
    expect(query.should.length).toBe(2)
    expect(query.should[0].bool.must[0].term['assetType.tree.keyword']).toBe('A1')
    expect(query.should[1].bool.must[0].term['assetType.tree.keyword']).toBe('A2')
    expect(query.must[0].match['assetType.virtual']).toBe(true)
  })
})

describe('assets value check', () => {
  it('should have correct array length', () => {
    expect(simplifiedResult.assetsByConditionAndFacility.length).toBe(3)
    expect(simplifiedResult.assetsByConditionAndFacility[0].length).toBe(2)
  })
  it('should return correct values', () => {
    expect(JSON.stringify(simplifiedResult.assetsByConditionAndFacility).indexOf('undefined')).toBe(
      -1,
    )
    expect(simplifiedResult.assetsByConditionAndFacility[0][0]).toBe(1)
    expect(simplifiedResult.assetsByConditionAndFacility[1][0]).toBe(1)
    expect(simplifiedResult.assetsByConditionAndFacility[0][1]).toBe(0)
  })
})

describe('es authentication', () => {
  it('should not be able to access to the other tenant', () => {
    jest.unmock('aws-sdk')
    const authenticatedTenant = '672FB50-BE2B-405D-9526-CB81427B7B7E'
    const accessingTenant = 'BA7E007F-761B-4A0F-AFAF-45B032AC19A2'
    const config = loadConfig(
      process.env.MWA_ACCOUNT,
      process.env.MWA_ENVIRONMENT,
      'application.yml',
    )
    config.environment = process.env.MWA_ENVIRONMENT
    global.mwa_config = config

    const {
      aws: { project_region: region },
    } = config
    const { userPoolId, userPoolWebClientId, identityPoolId, dns } = config.tenants[
      authenticatedTenant
    ]

    Amplify.configure({
      Auth: {
        region,
        userPoolId,
        userPoolWebClientId,
        identityPoolId,
      },
    })

    return Auth.signIn(`customer@${dns}`, 'Realm34$').then(() =>
      getAllAssets(accessingTenant).catch(err => {
        expect(err).toBeDefined()
      }),
    )
  })
})
