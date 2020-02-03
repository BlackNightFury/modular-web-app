const { expect } = require('chai')
const sql = require('mssql')
const fs = require('fs')
const jsyml = require('js-yaml')
const myLambda = require('./get-manufacturers')

// jest.setup.js
jest.setTimeout(30000)
jest.mock('mssql')
jest.mock('fs')
jest.mock('js-yaml')

jest.mock('elasticsearch', () => ({
  Client: () => ({
    search: () => ({
      hits: {
        hits: [],
      },
    }),
  }),
}))

describe('getManufacturers', () => {
  beforeAll(() => {
    process.env.CONFIG_INFO = `{"tenants":{"8720A63-FCE4-328E-3321-AD3F58797C7F":{"identityPoolId":"eu-west-2:ed76afc7-3495-4c5f-a0bd-4aefdec2b62f"}}}`
  })
  it('should de-duplicate LG misspellings', done => {
    sql.connect.mockResolvedValue({})
    sql.query.mockResolvedValue({
      recordset: [{ name: 'LG.' }, { name: 'L.G' }, { name: 'L G' }, { name: 'ALLIA' }],
    })

    fs.readFileSync.mockReturnValue('')
    jsyml.safeLoad.mockReturnValue({
      manufacturer_alias: { 'LG.': 'LG', 'L.G': 'LG', 'L G': 'LG' },
    })
    myLambda.lambda(
      {
        filters: {
          tenantId: '8720A63-FCE4-328E-3321-AD3F58797C7F',
        },
        identity: {
          cognitoIdentityPoolId: 'eu-west-2:ed76afc7-3495-4c5f-a0bd-4aefdec2b62f',
        },
      },
      null,
      (e, res) => {
        console.log('should de-duplicate LG misspellings e', e)
        
        if (e) {
          done(new Error(e.message))
        } else {
          const { manufacturers } = res

          expect(manufacturers.length).to.eql(2)
          expect(manufacturers[0]).to.eql('LG')
          expect(manufacturers[1]).to.eql('ALLIA')
          done()
        }
      },
    )
  })
})
