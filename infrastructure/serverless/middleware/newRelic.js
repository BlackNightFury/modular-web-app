//This piece of middleware isn't genuine middy middleware
//as new relic expects to wrap the underlying handler, not a middy object

const enabled = (process.env.NEW_RELIC_ENABLED && process.env.NEW_RELIC_ENABLED === "true")

const newRelicMiddleware = handler => {
	if (enabled) {
		const newrelic = require('newrelic')
		require('@newrelic/aws-sdk');
		return newrelic.setLambdaHandler(handler)
	}
  return handler
}

module.exports = newRelicMiddleware
