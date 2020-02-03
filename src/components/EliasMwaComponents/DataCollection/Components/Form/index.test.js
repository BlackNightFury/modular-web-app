const { generateSchema } = require('./index')

describe('Validate function for asset form', () => {
  it('Generate Schema', () => {
    const formInfo = {
      Description: [
        {
          key: 'quantity',
          value: 'Quantity',
          type: 'TextBox',
          validation: {
            mandatory: false,
          },
          order: 5,
          group: 'Description',
        },
        {
          key: 'condition',
          value: 'Condition',
          type: 'ComboBox',
          validation: {
            mandatory: false,
          },
          order: 80,
          group: 'Description',
          options: [
            { code: 'A', description: 'A', legacyId: 1 },
            { code: 'B', description: 'B', legacyId: 2 },
            { code: 'C', description: 'C', legacyId: 3 },
            { code: 'CX', description: 'CX', legacyId: 4 },
            { code: 'D', description: 'D', legacyId: 5 },
            { code: 'DX', description: 'DX', legacyId: 6 },
          ],
        },
      ],
      Others: [
        {
          key: 'install-date',
          value: 'Install Date',
          type: 'ComboBoxYear',
          validation: {
            mandatory: false,
          },
          order: 10,
          group: 'Others',
        },
      ],
    }

    const { parentSchema, parentUiSchema, flattenProperties } = generateSchema(formInfo)

    expect(parentSchema.properties).toHaveProperty('Description')
    expect(parentSchema.properties).toHaveProperty('Others')
    expect(parentUiSchema).toHaveProperty('Description')
    expect(parentUiSchema).toHaveProperty('Others')
    expect(parentUiSchema.Description).toHaveProperty('quantity')
    expect(flattenProperties).toHaveProperty('quantity')
    expect(flattenProperties).toHaveProperty('condition')
    expect(flattenProperties).toHaveProperty('install-date')
  })
})
