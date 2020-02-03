/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const middy = require('middy')

const applicationConfig = require('./applicationConfig')

const middyHandler = middy((event, context, cb) => {
  cb(null, event.tenantId)
}).use(applicationConfig)
const mockConfig = `{"tenants":{"672FB50-BE2B-405D-9526-CB81427B7B7E":{"identityPoolId":"eu-west-2:52c4660c-0319-4ab8-9d9f-f56a7dffc215"}}}`

describe('applicationConfigMiddleware', () => {
  const oldConfig = process.env.CONFIG_INFO
  beforeAll(() => {
    process.env.CONFIG_INFO = mockConfig
  })
  it('should map correct tenantId from cognito identity', done => {
    middyHandler(
      { identity: { cognitoIdentityPoolId: 'eu-west-2:52c4660c-0319-4ab8-9d9f-f56a7dffc215' } },
      {},
      (e, result) => {
        expect(e).to.be.null
        expect(result).to.eql('672FB50-BE2B-405D-9526-CB81427B7B7E')
        done()
      },
    )
  })
  it('should return error message from invalid cognito identity', done => {
    middyHandler({ identity: { cognitoIdentityId: 'invalid congito id' } }, {}, e => {
      expect(e).to.not.null
      done()
    })
  })
  afterAll(() => {
    process.env.CONFIG_INFO = oldConfig
  })
})
