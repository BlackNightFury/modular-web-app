export const getAllAssets = async () => []
export const getAssetsBySystemAndType = async () =>
  new Promise(resolve => {
    resolve([
      {
        doc_count: 25,
        key: 'Access',
        subTypes: [
          {
            doc_count: 13,
            key: 'Amplifier',
            assetType: {
              description: 'Amplifier',
              legacyId: 40456,
              tree: ['Access', 'Amplifier'],
              virtual: false,
            },
          },
          {
            doc_count: 7,
            key: 'Audio Visual Equipment',
            assetType: {
              description: 'Audio Visual Equipment',
              legacyId: 40457,
              tree: ['Access', 'Audio Visual Eq', 'Audio Visual Equipment'],
              virtual: false,
            },
          },
        ],
      },
    ])
  })

export const getConditionByFacilityAssetsAggregations = async () =>
  new Promise(resolve => {
    resolve([
      {
        facilityIds: ['LFA_29656', 'LFA_29657'],
        conditions: ['A', 'B', 'C', 'D'],
        assetsByConditionAndFacility: [[85, 87], [39, 25], [0, 0], [3, 3]],
      },
    ])
  })
export const getMyEstateStatus = async () => {}
export const getAssetsGroupedByFacility = async () => []
export const getReplacementCostStatistics = async () => {}
export const getAssetCostsByPriority = async () => ({
  P1UrgentCToDX: {
    name: 'P1',
    color: '#000',
    simpleReplacementCost: [],
  },
  P2HighCToDX: {
    name: 'P2',
    color: '#000',
    simpleReplacementCost: [],
  },
  P3MediumCToDX: {
    name: 'P3',
    color: '#000',
    simpleReplacementCost: [],
  },
  P4LowToVLowCToDx: {
    name: 'P4',
    color: '#000',
    simpleReplacementCost: [],
  },
})
export default {}
