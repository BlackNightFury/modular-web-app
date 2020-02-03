const Auth = require('@aws-amplify/auth').default
const API = require('@aws-amplify/api').default
const Amplify = require('@aws-amplify/core').default
const shortid = require('shortid')
global.fetch = require('node-fetch')
const { listProjectsQuery, listFacilitiesQuery, listFormResponsesQuery } = require('./queries')
const {
  deleteFacilityMutation,
  deleteProjectMutation,
  deleteFormResponseMutation,
  createProjectMutation,
  createFacilityMutation,
  createSiteMutation,
} = require('./mutations')

const random6DigitsGenerator = () => `${Math.floor(100000 + Math.random() * 900000)}`

const generateCleanUpFacility = (
  id,
  siteId,
  name,
  address,
  postcode,
  location,
  tenantId,
  options = {},
) => ({
  createdAtClient: new Date().toISOString(),
  createdBy: 'cleanUp',
  name,
  rag: 'A',
  status: 'NOT_STARTED',
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
    'facility-type': options.facilityType || 'Assembly and recreation building',
    'occupancy-normal': '1200',
    location,
    'facility-gia': '10000',
    'build-date': new Date().toISOString(),
    'contact-name': 'Test Contact',
    postcode,
  }),
  notes: JSON.stringify({
    'facility-use': 'Test Use',
    'contact-job-title': 'Test Contact Job Title',
    'contact-organization': 'Test Contact Organization',
    'contact-telephone': '+153292821324',
    'contact-mobile': '+1392821324',
    'contact-email': 'test@email.com',
    'facility-overview': 'Test Overview',
    address,
  }),
  id,
  tenantId,
  images: [],
  code: random6DigitsGenerator(),
})

const configureAmplify = async (configInfo, tenantId) => {
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
  await Auth.signIn(`surveyor@${configInfo.tenants[tenantId].dns}`, 'Realm34$')
}

const gql = (query, variables) =>
  API.graphql({
    query,
    variables,
    authMode: 'AWS_IAM',
  })

const listProjects = id => gql(listProjectsQuery, { tenantId: id })
const listFacilities = id => gql(listFacilitiesQuery, { tenantId: id })
const listFormResponses = id => gql(listFormResponsesQuery, { tenantId: id })
// TODO: Need this for delete all sites created. Come back in 10 days
// const listSites = id => gql(listSitesQuery, { tenantId: id })
// const deleteSite = input => gql(deleteSiteMutation, { input })
const deleteProject = input => gql(deleteProjectMutation, { input })
const deleteFacility = input => gql(deleteFacilityMutation, { input })
const deleteFormResponse = input => gql(deleteFormResponseMutation, { input })
const createProject = input => gql(createProjectMutation, { input })
const createFacility = input => gql(createFacilityMutation, { input })
const createSite = input => gql(createSiteMutation, { input })

module.exports.cleanUp = async (configInfo, tenantId) => {
  await configureAmplify(configInfo, tenantId)

  if (process.env.SKIP_DELETE === 'true') {
    console.log('SKIP_DELETE=true, bypassing delete', tenantId)
  } else {
    console.log('calling listProjects', tenantId)

    const projectsInfo = await listProjects(tenantId)
    console.log('listProjects result', projectsInfo.data.listProjects.items.length, projectsInfo)
    await Promise.all(
      projectsInfo.data.listProjects.items.map(item =>
        deleteProject({
          version: item.currentVersion || 'v0000',
          tenantId,
          id: item.id,
          force: true,
        }),
      ),
    )
    // TODO: Need to delete all sites. Will come back to within 10 days
    // const sitesInfo = await listSites(tenantId)
    // await Promise.all(
    //   sitesInfo.data.listSites.items.map(item =>
    //     deleteSite({
    //       version: item.currentVersion || 'v0000',
    //       tenantId,
    //       id: item.id,
    //       force: true,
    //     }),
    //   ),
    // )

    const facilitiesInfo = await listFacilities(tenantId)
    await Promise.all(
      facilitiesInfo.data.listFacilities.items.map(item =>
        deleteFacility({
          version: item.currentVersion || 'v0000',
          tenantId,
          id: item.id,
          force: true,
        }),
      ),
    )

    const formResponsesInfo = await listFormResponses(tenantId)
    await Promise.all(
      formResponsesInfo.data.listFormResponses.items.map(item =>
        deleteFormResponse({
          version: item.currentVersion || 'v0000',
          tenantId,
          id: item.id,
          force: true,
        }),
      ),
    )
  }

  const projectId = shortid.generate()
  const siteId = shortid.generate()

  // If it is REAMS tenant, then add different data
  if (tenantId === '1111111-1111-1111-1111-111111111111') {
    await createProject({
      createdAtClient: new Date().toISOString(),
      createdBy: 'cleanUp',
      name: `Surveyor conference 2019`,
      preSurveyQuestionnaire: 'basic-pre-survey',
      rag: 'A',
      sites: [siteId],
      docs: [
        {
          id: 'UATProjectDocument',
          text: 'Project docs',
        },
      ],
      id: projectId,
      tenantId,
      code: random6DigitsGenerator(),
    })

    await createSite({
      createdAtClient: new Date().toISOString(),
      createdBy: 'cleanUp',
      name: `Surveyor conference 2019`,
      tenantId,
      id: siteId,
      postcode: 'CF63 2AW',
      code: random6DigitsGenerator(),
    })

    console.log('Creating 30 facilities...')
    for (let i = 0; i < 30; i += 1) {
      const facilityId = shortid.generate()

      await createFacility(
        generateCleanUpFacility(
          facilityId,
          siteId,
          `Conference facility${i + 1}`,
          'London',
          'SW1A 2BL',
          {
            lat: '51.505846',
            lon: '-0.1293832',
          },
          tenantId,
        ),
      )
    }

    console.log('facility creation is done.')
    return
  }
  if (tenantId === '97000000-0000-0000-0000-00000000000') {
    //ba
    await createProject({
      createdAtClient: new Date().toISOString(),
      createdBy: 'cleanUp',
      name: `BA lounge survey 2019`,
      preSurveyQuestionnaire: 'basic-pre-survey',
      rag: 'A',
      sites: [siteId],
      docs: [
        {
          id: 'UATProjectDocument',
          text: 'Project docs',
        },
      ],
      id: projectId,
      tenantId,
      code: random6DigitsGenerator(),
    })

    await createSite({
      createdAtClient: new Date().toISOString(),
      createdBy: 'cleanUp',
      name: `Cardiff airport (CWL)`,
      tenantId,
      id: siteId,
      postcode: 'CF62 3BD',
      code: random6DigitsGenerator(),
    })

    const facilityId = shortid.generate()

    await createFacility(
      generateCleanUpFacility(
        facilityId,
        siteId,
        `Cardiff airport (CWL)`,
        'Rhoose',
        'CF62 3BD',
        {
          lat: '51.3982',
          lon: '3.3455',
        },
        tenantId,
        {
          facilityType: 'Airport',
        },
      ),
    )
    console.log('ba facility creation is done.')
    return
  }
  if (tenantId === '97000000-0000-0000-0000-00000000001') {
    //airbus
    await createProject({
      createdAtClient: new Date().toISOString(),
      createdBy: 'cleanUp',
      name: `Airbus`,
      preSurveyQuestionnaire: 'basic-pre-survey',
      rag: 'A',
      sites: [siteId],
      docs: [
        {
          id: 'UATProjectDocument',
          text: 'Project docs',
        },
      ],
      id: projectId,
      tenantId,
      code: '10754',
    })

    await createSite({
      createdAtClient: new Date().toISOString(),
      createdBy: 'cleanUp',
      name: `Filton`,
      tenantId,
      id: siteId,
      postcode: 'BS34 7PA',
      code: '10331',
    })

    let facilityId = shortid.generate()

    await createFacility(
      generateCleanUpFacility(
        facilityId,
        siteId,
        `Filton`,
        'Bristol',
        'BS34 7PA',
        {
          lat: '51.5107',
          lon: '2.5774',
        },
        tenantId,
        {
          facilityType: 'Airport',
        },
      ),
    )

    facilityId = shortid.generate()

    await createFacility(
      generateCleanUpFacility(
        facilityId,
        siteId,
        `Test facility`,
        'Bristol',
        'BS34 7PA',
        {
          lat: '51.5107',
          lon: '2.5774',
        },
        tenantId,
        {
          facilityType: 'Airport',
        },
      ),
    )
    console.log('airbus facility creation is done.')
    return
  }
  await createProject({
    createdAtClient: new Date().toISOString(),
    createdBy: 'cleanUp',
    name: `UAT Drop 2 (VS)${shortid.generate()}`,
    preSurveyQuestionnaire: 'basic-pre-survey',
    rag: 'A',
    sites: [siteId],
    docs: [
      {
        id: 'UATProjectDocument',
        text: 'Project docs',
      },
    ],
    id: projectId,
    tenantId,
    code: random6DigitsGenerator(),
  })

  await createSite({
    createdAtClient: new Date().toISOString(),
    createdBy: 'cleanUp',
    name: `UAT Drop 2 (VS)${shortid.generate()}`,
    tenantId,
    id: siteId,
    postcode: 'CF63 2AW',
    code: random6DigitsGenerator(),
  })

  let facilityId = shortid.generate()

  await createFacility(
    generateCleanUpFacility(
      facilityId,
      siteId,
      `facility 1${shortid.generate()}`,
      'London',
      'SW1A 2BL',
      {
        lat: '51.505846',
        lon: '-0.1293832',
      },
      tenantId,
    ),
  )

  facilityId = shortid.generate()

  await createFacility(
    generateCleanUpFacility(
      facilityId,
      siteId,
      `facility 2${shortid.generate()}`,
      'Beaumont St, Oxford',
      'OX1 2PH',
      {
        lat: '51.752934',
        lon: '-1.2718826',
      },
      tenantId,
    ),
  )

  facilityId = shortid.generate()

  await createFacility(
    generateCleanUpFacility(
      facilityId,
      siteId,
      `facility 3${shortid.generate()}`,
      'Management Suite, Grafton Centre, Cambridge',
      'CB1 1PS',
      {
        lat: '52.2027799',
        lon: '0.102867',
      },
      tenantId,
    ),
  )
}
