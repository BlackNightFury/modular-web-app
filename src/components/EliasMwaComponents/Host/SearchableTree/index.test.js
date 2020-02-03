const { makeFilterKeys } = require('./index')

describe('Check searchable tree functions', () => {
  it('Make Filter Keys', () => {
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
              },
            ],
          },
        ],
      },
    ]

    const filterKeys = makeFilterKeys(treeData, 'Amplifier')

    expect(filterKeys.length).toEqual(3)
    expect(filterKeys[0]).toEqual('Amplifier-40456')
    expect(filterKeys[1]).toEqual('Amplifier-16666-1')
    expect(filterKeys[2]).toEqual('Access-10724-12')
  })
})
