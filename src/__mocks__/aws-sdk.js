module.exports = {
  config: {
    update: () => {},
  },
  Credentials: () =>
    Object({
      test: jest.fn(),
    }),
  STS: () =>
    Object({
      assumeRole: (params, callback) =>
        callback(null, {
          Credentials: {
            AccessKeyId: 'AccessKeyId',
            SecretAccessKey: 'SecretAccessKey',
            SessionToken: 'SessionToken',
          },
        }),
    }),
}
