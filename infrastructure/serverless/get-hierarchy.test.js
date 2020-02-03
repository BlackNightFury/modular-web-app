const { expect } = require('chai')
const sql = require('mssql')
const fs = require('fs')

const myLambda = require('./get-hierarchy')
const sampleData = require('./get-hierarchy.test.json')

// jest.setup.js
jest.setTimeout(30000)
jest.mock('mssql')
jest.mock('csvtojson')
jest.mock('fs')

global.cachedData = {}

jest.mock('elasticsearch', () => ({
  Client: () => ({
    search: () => {
      if (Object.keys(global.cachedData).length === 0) {
        return {
          hits: {
            hits: [],
          },
        }
      }
      return {
        hits: {
          hits: [
            {
              _source: global.cachedData,
            },
          ],
        },
      }
    },
    index: ({ body }) => {
      global.cachedData = body
    },
  }),
}))

const mockLambda = sqlHierarchy => {
  sql.connect.mockResolvedValue({})
  sql.query.mockResolvedValueOnce({
    recordset: [
      {
        JSON_TEST: JSON.stringify(sqlHierarchy),
      },
    ],
  })
  sql.query.mockResolvedValue({
    recordset: [
      { condition_id: 2233, description: 'A - Description A', code: 'A', hierarchy_id: 47 },
      { condition_id: 2234, description: 'B - Description B', code: 'B', hierarchy_id: 47 },
      { condition_id: 2235, description: 'C - Description C', code: 'C', hierarchy_id: 47 },
      { condition_id: 2236, description: 'CX - Description CX', code: 'CX', hierarchy_id: 47 },
      { condition_id: 2237, description: 'D - Description D', code: 'D', hierarchy_id: 47 },
      { condition_id: 2238, description: 'DX - Description DX', code: 'DX', hierarchy_id: 47 },
    ],
  })

  fs.readdirSync.mockReturnValue(['47-concept-non-intrusive.yml'])
  fs.readFileSync
    .mockReturnValueOnce(
      `
  mandatory_fields:
    - Model
    - Serial Number
    - No Ways
    - No Spare Ways
    - Manufacturer
    - Refrigerant Type
    - Refrigerant Volume
    - Safe Working Load
    - Safe Working Pressure
    - Rating (
    - SWL (
  integer_fields:
    - Rating (
    - Refrigerant Weight
    - No Ways
    - No Spare Ways
    - Number of controls
  mapping:
    Condition Description (Must be a sentence):
      key: condition
      copy: false
      element: notes
      group: Information
      label: Condition Description
      help: Must be a sentence
    Local Asset Description:
      key: description
      copy: false
      element: notes
      group: Information
      label: Local Asset Description
    Notes:
      key: notes
      copy: false
      element: notes
      group: Information
      label: Notes`,
    )
    .mockReturnValue(
      `asset_types:
        mandatory_types: [40452, 40453, 40454, 40455]`,
    )

  return myLambda.getHierarchy({ projects: [{ tenantId: 'test', projectId: 214 }] })
}
describe('getHierarchy', () => {
  beforeEach(() => {
    console.log('beforeEach reset cache')
    global.cachedData = {}
    // process.env.CONFIG_INFO = `{"tenants":{"8720A63-FCE4-328E-3321-AD3F58797C7F":{"identityPoolId":"eu-west-2:ed76afc7-3495-4c5f-a0bd-4aefdec2b62f"}}}`
  })
  it('successful getting data', done => {
    mockLambda([
      {
        hierarchy_id: 47,
        type: 'Access',
        legacy_id: 10724,
        types: [
          {
            type: 'Access Eq',
            legacy_id: 16664,
            subtypes: [
              {
                legacy_id: 40452,
                type: 'Card Readers',
                facets: [
                  {
                    id: 227211,
                    question_id: 3,
                    text: 'Condition',
                    AssetColumnMappingId: 17,
                    AssetColumnTypeId: 1,
                    LookupTypeId: 13,
                    type: 'ComboBox',
                    LookUpTypeName: 'condition_lu',
                  },
                  {
                    id: 227212,
                    question_id: 4,
                    text: 'Quantity',
                    AssetColumnMappingId: 8,
                    AssetColumnTypeId: 1,
                    type: 'TextBox',
                  },
                  {
                    id: 227213,
                    question_id: 7,
                    text: 'Install Date',
                    AssetColumnMappingId: 9,
                    AssetColumnTypeId: 3,
                    type: 'ComboBoxYear',
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
      .then(res => {
        const subtype = res['214'].hierarchy[0].children[0].children[0]
        const { facets } = subtype

        expect(facets.length).to.eql(3)

        const facet = facets[0]
        expect(facet.key).to.eql('condition')
        expect(facet.options.length).to.eql(6)
        expect(facet.options[0].code).to.eql('A')
        expect(res['214'].hierarchyEnrichment.asset_types.mandatory_types[0]).to.equal(40452)
        expect(subtype.rics).to.eql('Boilers-Heat Generators-HVAC')
        expect(subtype.nrm).to.eql('5.5.1.1.2.3')
        expect(subtype['sfg-20-ref']).to.eql('05-10')
        expect(subtype['sfg-20-version']).to.eql('4')
        done()
      })
      .catch(e => {
        done(new Error(e.message))
      })
  })

  it('asset column type validation check', done => {
    mockLambda([
      {
        hierarchy_id: 47,
        type: 'Access',
        legacy_id: 10724,
        types: [
          {
            type: 'Access Eq',
            legacy_id: 16664,
            subtypes: [{ 
              legacy_id: 40452, 
              type: 'Card Readers', 
              facets: [
                {
                  id: 227213,
                  question_id: 8,
                  text: 'quantity',
                  AssetColumnMappingId: 11,
                  AssetColumnTypeId: 1,
                  AssetColumnType: 'NullableInt',
                  type: 'TextBox',
                },
                {
                  id: 227213,
                  question_id: 9,
                  text: 'model',
                  AssetColumnMappingId: 11,
                  AssetColumnTypeId: 1,
                  AssetColumnType: 'String',
                  type: 'TextBox',
                }
              ] 
            }],
          },
        ],
      },
    ])      
    .then(res => {
      const subtype = res['214'].hierarchy[0].children[0].children[0]
      const { facets } = subtype

      expect(facets.length).to.eql(2)
      const facet = facets[0]
      expect(facet.validation.isRegEx).to.eql(true)
      expect(facet.validation.value).to.eql('^[0-9]+$')
      expect(facet.validation.errorMessage).to.eql('Must be a number')
      expect(facet.validation.example).to.eql('5')
      const stringTypeFacet = facets[1]
      expect(stringTypeFacet.validation.isRegEx).to.eql(false)
      done()
    })
    .catch(e => {
      done(new Error(e.message))
    })
  })

  it('integer fields enrichment', done => {
    mockLambda([
      {
        hierarchy_id: 47,
        type: 'Access',
        legacy_id: 10724,
        types: [
          {
            type: 'Access Eq',
            legacy_id: 16664,
            subtypes: [{ 
              legacy_id: 40452, 
              type: 'Card Readers', 
              facets: [
                {
                  id: 227213,
                  question_id: 8,
                  text: 'Rating (kW)',
                  AssetColumnMappingId: 11,
                  AssetColumnTypeId: 2,
                  AssetColumnType: 'String',
                  type: 'TextBox',
                }
              ] 
            }],
          },
        ],
      },
    ])      
    .then(res => {
      const subtype = res['214'].hierarchy[0].children[0].children[0]
      const { facets } = subtype

      expect(facets.length).to.eql(1)
      const ratingFacet = facets[0]
      expect(ratingFacet.validation.isRegEx).to.eql(true)
      expect(ratingFacet.validation.value).to.eql('^[0-9]+$')
      expect(ratingFacet.validation.errorMessage).to.eql('Must be a number')
      expect(ratingFacet.validation.example).to.eql('5')
      done()
    })
    .catch(e => {
      done(new Error(e.message))
    })
  })

  it('subtype with no facets', done => {
    mockLambda([
      {
        hierarchy_id: 47,
        type: 'Access',
        legacy_id: 10724,
        types: [
          {
            type: 'Access Eq',
            legacy_id: 16664,
            subtypes: [{ legacy_id: 40452, type: 'Card Readers', facets: null }],
          },
        ],
      },
    ])
      .then(res => {
        console.log('no facets res', JSON.stringify(res))
        const subtype = res['214'].hierarchy[0].children[0].children[0]
        const { facets } = subtype

        expect(facets.length).to.eql(0)
        done()
      })
      .catch(e => {
        done(new Error(e.message))
      })
  })

  it('should reduce the lookup tables down to an array', () => {
    const lookups = myLambda.mapLookupTypes(sampleData)

    // console.log(lookups);
    expect(lookups).to.eql(['condition_lu'])
  })
})
