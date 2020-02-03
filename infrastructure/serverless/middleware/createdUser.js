const createdUserMiddleware = {
  before: (handler, next) => {
    const {
      event: { identity },
    } = handler

    const createdUser = (handler.event.input && handler.event.input.createdUser) || {}

    if (identity) {
      const { cognitoIdentityPoolId: identityPoolId } = identity
      createdUser.id = identityPoolId
    }

    if (handler.event.input) {
      handler.event.input.createdUser = createdUser
    }

    return next()
  },
}

module.exports = createdUserMiddleware
