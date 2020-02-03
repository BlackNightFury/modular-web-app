/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const middy = require('middy')

const createdUser = require('./createdUser')

const middyHandler = middy((event, context, cb) => {
  cb(null, event.input && event.input.createdUser)
}).use(createdUser)

describe('createdUserMiddleware', () => {
  it('get createdUser from cognitoIdentityPoolId', done => {
    middyHandler(
      {
        identity: { cognitoIdentityPoolId: 'eu-west-2:52c4660c-0319-4ab8-9d9f-f56a7dffc215' },
        input: {},
      },
      {},
      (e, result) => {
        expect(e).to.be.null
        expect(result.id).to.eql('eu-west-2:52c4660c-0319-4ab8-9d9f-f56a7dffc215')
        done()
      },
    )
  })
  it('nothing to get if input param is not defined', done => {
    middyHandler(
      {
        identity: { cognitoIdentityPoolId: 'eu-west-2:52c4660c-0319-4ab8-9d9f-f56a7dffc215' },
      },
      {},
      (e, result) => {
        expect(e).to.be.null
        expect(result).to.be.undefined
        done()
      },
    )
  })
})
