const {
  filterAssetTypeTreeData,
  removeEmptyValues,
  flattenToArray,
  flattenToObject,
  resetAssets,
  sort,
} = require('./utils')

const treeData = [
  {
    title: 'Access',
    value: 'Access-10724-12',
    key: 'Access-10724-12',
    children: [
      {
        title: 'Amplifier',
        value: 'Amplifier-16666-1',
        key: 'Amplifier-16666-1',
        children: [
          {
            title: 'Amplifier',
            value: 'Amplifier-40456',
            key: 'Amplifier-40456',
            facets: {
              Description: [
                {
                  key: 'quantity',
                },
              ],
            },
          },
        ],
      },
      {
        title: 'Audio Visual Eq',
        value: 'Audio Visual Eq-16667-1',
        key: 'Audio Visual Eq-16667-1',
        children: [
          {
            title: 'Audio Visual Equipment',
            value: 'Audio Visual Equipment-40457',
            key: 'Audio Visual Equipment-40457',
            facets: {
              Description: [
                {
                  key: 'quantity',
                  allowMultiple: true,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Controls',
    value: 'Controls-10726-9',
    key: 'Controls-10726-9',
    children: [
      {
        title: 'Bms',
        value: 'Bms-16692-4',
        key: 'Bms-16692-4',
        children: [
          {
            title: 'Bms - Communications',
            value: 'Bms - Communications-40643',
            key: 'Bms - Communications-40643',
            facets: {
              Description: [
                {
                  key: 'quantity',
                  allowMultiple: false,
                },
              ],
            },
          },
        ],
      },
    ],
  },
]

describe('Asset type tree filtering', () => {
  it('should return all types if no filter provided', () => {
    const filteredAssetTypeTreeData = filterAssetTypeTreeData(treeData, [])
    expect(filteredAssetTypeTreeData.length).toEqual(2)
    expect(filteredAssetTypeTreeData[0].children.length).toEqual(2)
    expect(filteredAssetTypeTreeData[0].children[0].children.length).toEqual(1)
    expect(filteredAssetTypeTreeData[0].children[0].children[0].value).toEqual('Amplifier-40456')
    expect(filteredAssetTypeTreeData[0].children[1].children.length).toEqual(1)
    expect(filteredAssetTypeTreeData[1].children.length).toEqual(1)
  })

  it('should filter by existing item', () => {
    const assets = [
      {
        type: 'Amplifier-40456',
      },
      {
        type: 'Bms - Communications-40643',
      },
    ]
    const filteredAssetTypeTreeData = filterAssetTypeTreeData(treeData, assets)
    expect(filteredAssetTypeTreeData.length).toEqual(2)
    expect(filteredAssetTypeTreeData[0].children.length).toEqual(1)
    expect(filteredAssetTypeTreeData[0].children[0].children.length).toEqual(1)
    expect(filteredAssetTypeTreeData[0].children[0].children[0].value).toEqual('Amplifier-40456')
    expect(filteredAssetTypeTreeData[1].children.length).toEqual(1)
  })

  it('should not break if a non-existent asset type is used', () => {
    const assets = [
      {
        type: 'Amplifier-40456',
      },
      {
        type: 'non-existent-asset',
      },
    ]
    const filteredAssetTypeTreeData = filterAssetTypeTreeData(treeData, assets)
    expect(filteredAssetTypeTreeData.length).toEqual(1)
    expect(filteredAssetTypeTreeData[0].children.length).toEqual(1)
    expect(filteredAssetTypeTreeData[0].children[0].children.length).toEqual(1)
    expect(filteredAssetTypeTreeData[0].children[0].children[0].value).toEqual('Amplifier-40456')
  })
})

describe('Empty values removing', () => {
  it('should return all values if no empty values provided', () => {
    const data = removeEmptyValues({
      condition: 'B',
      quantity: '1',
      notes: 'Good',
      UndefinedTest: undefined,
    })
    expect(Object.keys(data).length).toEqual(4)
    expect(data.condition).toEqual('B')
    expect(data.UndefinedTest).toEqual(null)
  })

  it('should remove empty values', () => {
    const data = removeEmptyValues({ condition: 'B', quantity: '1', notes: '' })
    expect(Object.keys(data).length).toEqual(2)
    expect(data.notes).toBeUndefined()
  })

  it('should not break if an empty array is used', () => {
    const data = removeEmptyValues({})
    expect(data).toEqual({})
  })
})

describe('flatten value to array', () => {
  it('should map flatten to array', () => {
    const data = flattenToArray({
      Description: [{ key: 'condition' }, { key: 'quantity' }],
      Information: [{ key: 'model' }],
    })
    expect(data.length).toEqual(3)
    expect(data[0].key).toEqual('condition')
  })

  it('should not break if an empty flatten is used', () => {
    const data = flattenToArray({})
    expect(data).toEqual([])
  })
})

describe('flatten value to object', () => {
  it('should map flatten to object', () => {
    const data = flattenToObject({
      Description: { condition: 'B', quantity: '1' },
      Information: { model: 'dog' },
    })
    expect(Object.keys(data).length).toEqual(3)
    expect(data.condition).toBeDefined()
    expect(data.condition).toEqual('B')
  })

  it('should not break if an empty flatten is used', () => {
    const data = flattenToObject({})
    expect(data).toEqual({})
  })
})

describe('Assets quantity reseting by allowMultiple property', () => {
  it('quantity should be 1 if allowMultiple property is non-existent', () => {
    const assets = [
      {
        type: 'Amplifier-40456',
        quantity: 0,
      },
    ]
    const newAssets = resetAssets(treeData, assets)
    expect(newAssets.length).toEqual(1)
    expect(newAssets[0].quantity).toEqual(1)
  })

  it('quantity should be 1 if allowMultiple property is false', () => {
    const assets = [
      {
        type: 'Bms - Communications-40643',
        quantity: 0,
      },
    ]
    const newAssets = resetAssets(treeData, assets)
    expect(newAssets.length).toEqual(1)
    expect(newAssets[0].quantity).toEqual(1)
  })

  it('quantity should not be changed if allowMultiple property is true', () => {
    const assets = [
      {
        type: 'Audio Visual Equipment-40457',
        quantity: 10,
      },
    ]
    const newAssets = resetAssets(treeData, assets)
    expect(newAssets.length).toEqual(1)
    expect(newAssets[0].quantity).toEqual(10)
  })
})

describe('check sort functions', () => {
  it('number sort ascending', () => {
    const origin = [
      {
        assets: 5,
        name: 'test',
      },
      {
        assets: 14,
        name: 'test2',
      },
      {
        assets: 6,
        name: 'test4',
      },
      {
        assets: 4,
        name: 'test1',
      },
    ]
    const sortedArray = sort(origin, 'assets', true)
    expect(sortedArray[0].assets).toEqual(4)
    expect(sortedArray[3].assets).toEqual(14)
  })

  it('string sort ascending', () => {
    const origin = [
      {
        assets: 5,
        name: 'test',
      },
      {
        assets: 14,
        name: 'test2',
      },
      {
        assets: 6,
        name: 'test4',
      },
      {
        assets: 4,
        name: 'test1',
      },
    ]
    const sortedArray = sort(origin, 'name', false)
    expect(sortedArray[0].name).toEqual('test4')
    expect(sortedArray[3].name).toEqual('test')
  })

  it('sort by function', () => {
    const origin = [
      {
        assets: 5,
        name: 'test',
      },
      {
        assets: 14,
        name: 'test2',
      },
      {
        assets: 6,
        name: 'test4',
      },
      {
        assets: 4,
        name: 'test1',
      },
    ]
    const sortBy = (a, b) => a.name.localeCompare(b.name)
    const sortedArray = sort(origin, sortBy, false)
    expect(sortedArray[0].name).toEqual('test4')
    expect(sortedArray[3].name).toEqual('test')
  })
})
