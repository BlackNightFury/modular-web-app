/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const middy = require('middy')
const tenantAuthorisation = require('./tenantAuthorisation')

const middyHandler = middy((event, context, cb) => {
  cb(null, event.esIndex)
}).use(tenantAuthorisation('reader', 'filters'))

describe('tenantAuthorisationMiddleware', () => {
  it('should get all tenants if it is admin', done => {
    middyHandler({ tenantId: 'admin', filters: {}, environment: 'slav' }, {}, (e, result) => {
      expect(e).to.be.null
      expect(result).to.eql('slav-*')
      done()
    })
  })
  it('should get all tenants if it is global-user', done => {
    middyHandler({ tenantId: 'global-user', filters: {}, environment: 'slav' }, {}, (e, result) => {
      expect(e).to.be.null
      expect(result).to.eql('slav-*')
      done()
    })
  })
  it('should get error if the identity tenant and the tenant in the request are different', done => {
    middyHandler(
      {
        tenantId: 'BA7E007F-761B-4A0F-AFAF-45B032AC19A2',
        filters: { tenantId: '672fb50-be2b-405d-9526-cb81427b7b7e' },
        environment: 'slav',
      },
      {},
      e => {
        expect(e).to.not.null
        done()
      },
    )
  })
  it('should get tenant from the identity when the user is not admin', done => {
    middyHandler(
      { tenantId: '672fb50-be2b-405d-9526-cb81427b7b7e', filters: {}, environment: 'slav' },
      {},
      (e, result) => {
        expect(e).to.be.null
        expect(result).to.eql('slav-672fb50-be2b-405d-9526-cb81427b7b7e')
        done()
      },
    )
  })
})
