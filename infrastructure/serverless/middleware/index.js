const middy = require('middy')
const newRelicMiddleware = require('./newRelic')
const createdUserMiddleware = require('./createdUser')
const applicationConfigMiddleware = require('./applicationConfig')
const tenantAuthorisationMiddleware = require('./tenantAuthorisation')

const errorLogger = {
  onError: handler => Promise.reject(handler.error)
}

const simpleMiddleware = (handler) =>
  middy(newRelicMiddleware(handler))
    .use(applicationConfigMiddleware)
    .use(errorLogger)

const defaultMiddleware = (handler, options) =>
  simpleMiddleware(handler, options)
    .use(createdUserMiddleware)
    .use(tenantAuthorisationMiddleware(options.role, options.idLocation))

module.exports.simple = simpleMiddleware
module.exports.default = defaultMiddleware
