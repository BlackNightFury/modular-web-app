const Amplify = require('aws-amplify').default
const { loadConfig } = require('../../scripts/get-config')
const { random6DigitsGenerator } = require('../../src/services/utils')

const TEST_ACCOUNT = process.env.MWA_ACCOUNT || 'test'
const TEST_STAGE = process.env.MWA_STAGE || 'int'
export const TEST_SURVEYOR_EMAIL = 'surveyor@testtenant.com'
export const TEST_CUSTOMER_EMAIL = 'customer@testtenant.com'
export const TEST_PASSWORD = 'Realm34$'

export const configInfo = loadConfig(TEST_ACCOUNT, TEST_STAGE, 'application.yml')
export const tenantId = Object.keys(configInfo.tenants).find(
  id => configInfo.tenants[id].dns === TEST_SURVEYOR_EMAIL.split('@')[1],
)

export const otherTenantId = Object.keys(configInfo.tenants).find(
  id => configInfo.tenants[id].dns !== TEST_SURVEYOR_EMAIL.split('@')[1],
)
export const tenantInfo = configInfo.tenants[tenantId]
export const { project_region: region } = configInfo.aws
export const { userPoolId, userPoolWebClientId, identityPoolId, assetImagesS3Bucket } = tenantInfo

export const configureAmplify = () => {
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
}

export const configAWSCredential = async () => {
  const AWS = require('aws-sdk')
  AWS.CredentialProviderChain.defaultProviders = []
  AWS.config.update({
    credentials: await Amplify.Auth.currentUserCredentials(),
    region,
  })
}

export const generateTestProjectData = (id, sites) => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'TESTING',
  name: `TESTING PROJECT${id}`,
  preSurveyQuestionnaire: 'basic-pre-survey',
  rag: 'A',
  readonly: false,
  sites,
  docs: [
    {
      id: 'UATProjectDocument',
      text: 'Project docs',
    },
  ],
  id,
  tenantId,
  code: random6DigitsGenerator(),
})

export const generateTestSiteData = id => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'TESTING',
  name: `TESTING SITE${id}`,
  id,
  tenantId,
  postcode: 'TEST POST CODE',
  code: random6DigitsGenerator(),
})

export const generateTestFacilityData = (id, siteId, status, withImage) => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'TESTING',
  name: `TESTING FACILITY${id}`,
  rag: 'A',
  status,
  siteId,
  docs: [
    {
      id: 'UATPAsbestosRegister',
      text: 'Asbestos register',
    },
    {
      id: 'UATPFacilityNotes',
      text: 'Facility notes',
    },
    {
      id: 'UATPFacilityRiskAssessment',
      text: 'Facility risk assesment',
    },
  ],
  facets: JSON.stringify({
    'facility-type': 'Assembly and recreation building',
    'occupancy-normal': '1200',
    location: {
      lat: '51.505846',
      lon: '-0.1293832',
    },
    'facility-gia': '10000',
    'build-date': new Date().toISOString(),
    'contact-name': 'Test Contact',
    postcode: 'SW1A 2BL',
  }),
  notes: JSON.stringify({
    'facility-use': 'Test Use',
    'contact-job-title': 'Test Contact Job Title',
    'contact-organization': 'Test Contact Organization',
    'contact-telephone': '+153292821324',
    'contact-mobile': '+1392821324',
    'contact-email': 'test@email.com',
    'facility-overview': 'Test Overview',
    address: 'London',
  }),
  id,
  tenantId,
  code: random6DigitsGenerator(),
  ...(withImage
    ? {
        images: [
          {
            dataUri: null,
            picture: {
              bucket: assetImagesS3Bucket,
              key: 'test.png',
            },
          },
        ],
      }
    : {}),
})

export const generateTestFloorData = (facilityId, id, status) => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'TESTING',
  name: `TESTING FLOOR${id}`,
  status: status || 'IN_PROGRESS',
  id,
  tenantId,
  facilityId,
})

export const generateTestSpaceData = (facilityId, floorId, id, status) => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'TESTING',
  name: `TESTING SPACE${id}`,
  type: 'Balcony',
  status: status || 'IN_PROGRESS',
  id,
  floorId,
  tenantId,
  facilityId,
})

export const generateInaccessibleTestSpaceData = (facilityId, floorId, id, status) => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'TESTING',
  name: `TESTING SPACE${id}`,
  type: 'Balcony',
  status: status || 'INACCESSIBLE',
  availableDate: '2030-06-29T07:56:36.261Z',
  id,
  floorId,
  tenantId,
  facilityId,
})

export const generateTestAssetData = (facilityId, floorId, spaceId, projectId, siteId, id) => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'TESTING',
  assetType: {
    description: 'Audio Visual Equipment',
    legacyId: 28754,
    tree: ['Access', 'Audio Visual Eq', 'Audio Visual Equipment'],
    virtual: false,
  },
  facets: JSON.stringify({
    quantity: 1,
    condition: { code: 'B', description: 'B', legacyId: 2211 },
    'install-date': '2019-08-05T07:36:50.899Z',
    barcode: '610718',
    accessibility: 'High Level (>3m)',
    'asset-status': 'Operating',
    criticality: 'Low',
    manufacturer: 'CALOREX HEAT PUMP LTD',
    model: 'degree',
    'maintenance-requirement': 'Run to Fail',
  }),
  notes: JSON.stringify({
    description: 'Chiller No 3',
  }),
  images: [],
  projectId,
  siteId,
  id,
  tenantId,
  facilityId,
  spaceId,
  floorId,
})
