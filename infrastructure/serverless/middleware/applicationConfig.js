const applicationConfigMiddleware = {
  before: (handler, next) => {
    const {
      event: { identity },
      callback,
    } = handler

    let tenantId
    let tenantInfo

    if (identity && process.env.CONFIG_INFO) {
      const { cognitoIdentityPoolId: identityPoolId } = identity
      const { tenants, globalUser } = JSON.parse(process.env.CONFIG_INFO)

      if (identityPoolId) {
        tenantId = Object.keys(tenants).find(
          tenant => tenants[tenant].identityPoolId === identityPoolId,
        )

        if (!tenantId && globalUser.identityPoolId === identityPoolId) {
          tenantId = 'global-user'
        }

        if (!tenantId) {
          return callback(new Error('NOT_FOUND_TENANTID'))
        }

        tenantInfo = {
          ...(tenantId === 'global-user' ? globalUser : tenants[tenantId]),
        }

        if (tenantId === 'admin') {
          tenantInfo.isAdmin = true
        }

        if (tenantId === 'global-user') {
          tenantInfo.isGlobalUser = true
        }
      } else {
        tenantId = 'admin'
        tenantInfo = {
          ...tenants.admin,
          isAdmin: true,
        }
      }
    }

    handler.event.tenantId = tenantId
    handler.event.tenantInfo = tenantInfo
    return next()
  },
}

module.exports = applicationConfigMiddleware
