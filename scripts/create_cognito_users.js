#!/usr/bin/env node
const yargs = require('yargs')
const _ = require('lodash')
const { execSync } = require('child_process')
const { loadConfig } = require('./get-config')

// const authConfig = {
//   reams : [
//     {
//       userName: 'conf-user1',
//       password: 'MetalCrazyAllies@99',
//     },
//     {
//       userName: 'conf-user2',
//       password: 'CystCoughSlave@99',
//     },
//     {
//       userName: 'conf-user3',
//       password: 'SynonymRevertBlurred@99',
//     },
//     {
//       userName: 'conf-user4',
//       password: 'KillsPreciseSuffers@99',
//     },
//     {
//       userName: 'conf-user5',
//       password: 'ProudAikenSticker@99',
//     },
//     {
//       userName: 'conf-user6',
//       password: 'ClawsFramingCurse@99',
//     },
//     {
//       userName: 'conf-user7',
//       password: 'OneselfNotingReduced@99',
//     },
//     {
//       userName: 'conf-user8',
//       password: 'AidaAwashLeisure@99',
//     },
//     {
//       userName: 'conf-user9',
//       password: 'BaroqueSistersLore@99',
//     },
//     {
//       userName: 'conf-user10',
//       password: 'TrashCoveredHigher@99',
//     },
//     {
//       userName: 'conf-user11',
//       password: 'PaymentComaDancer@99',
//     },
//     {
//       userName: 'conf-user12',
//       password: 'ChronicBeakConway@99',
//     },
//     {
//       userName: 'conf-user13',
//       password: 'LoadedFloutDeuce@99',
//     },
//     {
//       userName: 'conf-user14',
//       password: 'EastOptionScrolls@99',
//     },
//     {
//       userName: 'conf-user15',
//       password: 'JewelEdersEasily@99',
//     },
//   ],
//   airbus: [
//     {
//       userName: 'surveyor1',
//       password: 'a@AL^0j9qU',
//     },
//     {
//       userName: 'surveyor2',
//       password: 'daqQ8TaK1*a^',
//     }
//   ]

// }

const DEFAULT = [
  {
    userName: 'customer',
    password: 'Realm34$',
  },
  {
    userName: 'surveyor',
    password: 'Realm34$',
  },
]

yargs.parserConfiguration({
  'camel-case-expansion': false,
  // "dot-notation": false
})

const { argv } = yargs.command('$0 [account] [tenant]', 'Add test users').help()

const { account, tenant: tenantId } = argv

// console.log(argv)
// process.exit()

accountInfo = loadConfig(account, '', 'application.yml')

// console.log(accountInfo)
// process.exit()

const { tenants } = accountInfo

const config = accountInfo[tenantId] || tenants[tenantId]

// console.log('config', config)
// process.exit()

const { dns, userPoolId, userPoolWebClientId } = config

const USERS = DEFAULT // authConfig[id] ? _.union(DEFAULT, authConfig[id]) : DEFAULT

console.log('USERS', USERS)
// process.exit()

_.each(USERS, ({ userName, password }) => {
  const email = `${userName}@${dns}`
  console.log(`Creating a user with email(${email})...`)

  const resultBuffer = execSync(
    `aws cognito-idp admin-initiate-auth --user-pool-id ${userPoolId} --client-id ${userPoolWebClientId} --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=${email},PASSWORD=${password}`,
  )

  // console.log('resultBuffer', resultBuffer)
  // process.exit()
  const { Session } = JSON.parse(resultBuffer.toString())

  if (Session) {
    execSync(
      `aws cognito-idp admin-respond-to-auth-challenge --user-pool-id ${userPoolId} --client-id ${userPoolWebClientId} --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=${password},USERNAME=${email} --session ${Session}`,
    )
  }

  // console.log(`User with email(${email}) is successfuly created.`)
})

// Commented as we are not using aws-sdk to create users
// const createViaAwsSDK = (userPoolId, email, password) => {
//   const cognito = new aws.CognitoIdentityServiceProvider()

//   return cognito
//     .adminCreateUser({
//       UserPoolId: userPoolId,
//       Username: email,
//       DesiredDeliveryMediums: [],
//       MessageAction: 'SUPPRESS',
//       TemporaryPassword: password,
//       UserAttributes: [
//         {
//           Name: 'Name',
//           Value: email,
//         },
//         {
//           Name: 'phone_number',
//           Value: '+15555551212',
//         },
//         /* more items */
//       ],
//     })
//     .promise()
//     .then(
//       data => {
//         console.log('creeated user data', data)
//         process.exit()
//       },
//       error => {
//         console.log('creeated user error', error)
//         process.exit()
//       },
//     )
// }
