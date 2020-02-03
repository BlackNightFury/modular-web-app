const AWS = require('aws-sdk')

AWS.config.logger = console;

const sts = new AWS.STS( { httpOptions : { connectTimeout:10000, timeout : 10000 }, region : 'eu-west-2', endpoint : 'sts.eu-west-2.amazonaws.com' })

const getCrossAccountCredentials = async (role, tenantInfo) => {
  console.log(`getCrossAccountCredentials role=${role}`)

  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime()
    let user = 'admin'
    if (tenantInfo) {
      if (tenantInfo.isGlobalUser) {
        user = 'global-user'
      } else if (tenantInfo.isAdmin) {
        user = 'admin'
      } else {
        user = tenantInfo.id
      }
    }

    const params = {
      RoleArn: `arn:aws:iam::${process.env.ACCOUNT_ID}:role/elias-mwa-${process.env.ACCOUNT}-lambda-${user}-appsync-${role}`,
      RoleSessionName: `elias-mwa-developer-${timestamp}`,
    }
    
    console.log(`getCrossAccountCredentials assuming role`, params)
  
    sts.assumeRole(params, (err, data) => {
      if (err) {
        console.log(`getCrossAccountCredentials assume role error`, err)
        reject(err)
      } 
      else {
        resolve({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken,
        })
      }
    })
  })
}

const tenantAuthorisationMiddleware = (role, idLocation) => ({
  before: async handler => {
    const {
      event: { environment, tenantId, tenantInfo, [idLocation]: identity },
    } = handler

    let esIndex
    if (tenantId === 'admin' || tenantId === 'global-user') {
      if (identity.tenantId) esIndex = identity.tenantId.toLowerCase()
      else {
        esIndex = '*'
      }
    } else if (
      !identity.tenantId ||
      (identity.tenantId && tenantId && tenantId.toLowerCase() === identity.tenantId.toLowerCase())
    ) {
      esIndex = tenantId.toLowerCase()
    }

    if (!esIndex) {
      throw new Error('TENANT_ACCESS_DENIED')
    }

    const credentials = await getCrossAccountCredentials(role, tenantInfo)

    AWS.config.update({
      region: 'eu-west-2',
      credentials: new AWS.Credentials(
        credentials.accessKeyId,
        credentials.secretAccessKey,
        credentials.sessionToken,
      ),
    })

    handler.event.esIndex = `${environment}-${esIndex}`
  },
})

module.exports = tenantAuthorisationMiddleware
