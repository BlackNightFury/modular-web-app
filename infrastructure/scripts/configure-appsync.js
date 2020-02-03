const Auth = require('@aws-amplify/auth').default //eslint-disable-line
const API = require('@aws-amplify/api').default //eslint-disable-line
const Amplify = require('@aws-amplify/core').default //eslint-disable-line
global.fetch = require('node-fetch') //eslint-disable-line

const configureAmplify = async (configInfo, tenantId) => {
  // console.log('configureAmplify tenantId', tenantId)
  const {
    userPoolId,
    userPoolWebClientId,
    identityPoolId,
    assetImagesS3Bucket,
  } = configInfo.tenants[tenantId]
  const { project_region: region } = configInfo.aws

  Amplify.configure({
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId,
      identityPoolId,
    },
    Storage: {
      AWSS3: {
        bucket: assetImagesS3Bucket,
        region,
      },
    },
    aws_appsync_graphqlEndpoint: configInfo.aws.appsync.graphqlEndpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: 'AWS_IAM',
  })
  // console.log('logging in')
  await Auth.signIn(`surveyor@${configInfo.tenants[tenantId].dns}`, 'Realm34$')
  // console.log('logged in', a)
}

const gql = (query, variables) =>
  API.graphql({
    query,
    variables,
    authMode: 'AWS_IAM',
  })

module.exports = {
  configureAmplify,
  gql,
}
