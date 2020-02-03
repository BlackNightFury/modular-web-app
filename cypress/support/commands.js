// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload'

import moment from 'moment'
import shortid from 'shortid'
import { ListProjects } from '../../src/graphql/queries'
import {
  UpdateProject,
  UpdateFormResponse,
  CreateSite,
  CreateProject,
  CreateFacility,
  CreateFloor,
  CreateSpace,
  CreateAsset,
  UpdateAsset,
  UpdateFloor,
  UpdateSpace,
} from '../../src/graphql/mutations'
import { padWithZeros } from '../../src/services/asset'
import { random6DigitsGenerator } from '../../src/services/utils'

const { Auth, API, graphqlOperation } = require('aws-amplify')
const Amplify = require('aws-amplify').default

const tenantId = '3333333-3333-3333-3333-333333333333'

Cypress.Commands.add('configureAmplify', mwaConfig => {
  const {
    userPoolId,
    userPoolWebClientId,
    identityPoolId,
    assetImagesS3Bucket,
  } = mwaConfig.tenants[tenantId]
  const { project_region: region } = mwaConfig.aws
  const { graphqlEndpoint, authenticationType } = mwaConfig.aws.appsync
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
    aws_appsync_graphqlEndpoint: graphqlEndpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: authenticationType,
  })
  Auth.signIn('surveyor@testtenant.com', 'Realm34$')
})

Cypress.Commands.add('completeSurveyor', () => {
  API.graphql(graphqlOperation(ListProjects, { tenantId })).then(projectInfo => {
    const currentProject = projectInfo.data.listProjects.items.filter(
      item => item.id === Cypress.env('projectId'),
    )
    const { readonly, currentVersion, createdAt, ...restData } = currentProject[0]
    const version = `v${padWithZeros(
      (currentVersion ? parseInt(currentVersion.slice(1), 10) : 0) + 1,
      4,
    )}`
    API.graphql(
      graphqlOperation(UpdateProject, {
        input: {
          ...restData,
          tenantId,
          createdAtClient: moment().toISOString(),
          createdBy: 'TESTING',
          version,
          readonly: true,
        },
      }),
    )
  })
})

Cypress.Commands.add('updateFacilityCompletion', () => {
  API.graphql(graphqlOperation(ListProjects, { tenantId })).then(projectInfo => {
    const { listFormResponses } = projectInfo.data
    const completeFacilityResponses = (listFormResponses ? listFormResponses.items : []).filter(
      formResponse => {
        const { type } = JSON.parse(formResponse.response)
        return type === 'facility-completion'
      },
    )

    completeFacilityResponses.map(async facilityResponse => {
      const { currentVersion } = facilityResponse
      const version = `v${padWithZeros(parseInt(currentVersion.slice(1), 10) + 1, 4)}`
      const responseObj = JSON.parse(facilityResponse.response)
      facilityResponse.response = JSON.stringify({
        ...responseObj,
        status: 'inProgress',
      })
      await API.graphql(
        graphqlOperation(UpdateFormResponse, {
          input: {
            ...facilityResponse,
            tenantId,
            createdAtClient: moment().toISOString(),
            createdBy: 'modular-web-application-js-datacollection-module',
            version,
          },
        }),
      )
    })
  })
})

Cypress.Commands.add('getFacilityId', () => Cypress.env('facilityId'))
Cypress.Commands.add('getSourceSpaceInfo', () => ({
  facilityId: Cypress.env('sFacilityId'),
  floorId: Cypress.env('sFloorId'),
  spaceId: Cypress.env('sSpaceId'),
}))

Cypress.Commands.add('createAsset', options => {
  cy.createSpace().then({ timeout: 10000 }, () => {
    const assetId = shortid.generate()
    Cypress.env('assetId', assetId)
    API.graphql(
      graphqlOperation(CreateAsset, {
        input: {
          createdAtClient: new Date().toISOString(),
          createdBy: 'TESTING',
          assetType: {
            description: 'Amplifier',
            legacyId: 40456,
            tree: ['Access', 'Amplifier'],
            virtual: false,
          },
          facets: JSON.stringify({
            quantity: '1',
            condition: {
              code: 'B',
              description: 'B',
              legacyId: 2211,
            },
            'install-date': '2019-08-05T07:36:50.899Z',
            barcode: '610718876',
            accessibility: 'High Level (>3m)',
            'asset-status': 'Operating',
            criticality: 'Low',
            manufacturer: 'CALOREX HEAT PUMP LTD',
            model: 'degree',
            'maintenance-requirement': 'Run to Fail',
          }),
          notes:
            options && options.wrongUntagged
              ? null
              : JSON.stringify({ description: 'Chiller No 3' }),
          images: [],
          projectId: Cypress.env('projectId'),
          siteId: Cypress.env('siteId'),
          id: assetId,
          tenantId,
          facilityId: Cypress.env('facilityId'),
          spaceId: Cypress.env('spaceId'),
          floorId: Cypress.env('floorId'),
        },
      }),
    )
  })
})

Cypress.Commands.add('createAssetWithImageInOtherTenant', () => {
  cy.createSpace().then({ timeout: 10000 }, () => {
    const assetId = shortid.generate()
    Cypress.env('assetId', assetId)
    API.graphql(
      graphqlOperation(CreateAsset, {
        input: {
          createdAtClient: new Date().toISOString(),
          createdBy: 'TESTING',
          assetType: {
            description: 'Amplifier',
            legacyId: 40456,
            tree: ['Access', 'Amplifier'],
            virtual: false,
          },
          facets: JSON.stringify({
            quantity: '1',
            condition: { code: 'B', description: 'B', legacyId: 2211 },
            'install-date': '2019-08-05T07:36:50.899Z',
            barcode: '610718876',
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
          projectId: Cypress.env('projectId'),
          siteId: Cypress.env('siteId'),
          id: assetId,
          tenantId,
          facilityId: Cypress.env('facilityId'),
          spaceId: Cypress.env('spaceId'),
          floorId: Cypress.env('floorId'),
        },
      }),
    ).then(() => {
      API.graphql(
        graphqlOperation(UpdateAsset, {
          input: {
            createdAtClient: new Date().toISOString(),
            createdBy: 'TESTING',
            assetType: {
              description: 'Amplifier',
              legacyId: 40456,
              tree: ['Access', 'Amplifier'],
              virtual: false,
            },
            facets: JSON.stringify({
              'local-asset-description': 'Chiller No 3',
              quantity: '1',
              condition: { code: 'B', description: 'B', legacyId: 2211 },
              'install-date': '2019-08-05T07:36:50.899Z',
              barcode: '610718876',
              accessibility: 'High Level (>3m)',
              'asset-status': 'Operating',
              criticality: 'Low',
              manufacturer: 'CALOREX HEAT PUMP LTD',
              model: 'degree',
              'maintenance-requirement': 'Run to Fail',
            }),
            notes: '{}',
            images: [
              {
                dataUri: null,
                picture: {
                  bucket: 'reams-elias-mwa-dev-tenant1-images',
                  key: '1PXv4nrKu/1566416583935.png',
                },
              },
            ],
            projectId: Cypress.env('projectId'),
            siteId: Cypress.env('siteId'),
            id: assetId,
            tenantId,
            facilityId: Cypress.env('facilityId'),
            spaceId: Cypress.env('spaceId'),
            floorId: Cypress.env('floorId'),
            version: 'v0002',
          },
        }),
      )
    })
  })
})

Cypress.Commands.add('createVirtualAsset', () => {
  cy.createFloor().then({ timeout: 10000 }, () => {
    const virtualAssetId = shortid.generate()
    Cypress.env('virtualAssetId', virtualAssetId)
    API.graphql(
      graphqlOperation(CreateAsset, {
        input: {
          createdAtClient: new Date().toISOString(),
          createdBy: 'TESTING',
          assetType: {
            description: 'Card Readers',
            legacyId: 40452,
            tree: ['Access', 'Access Eq', 'Card Readers'],
            virtual: true,
          },
          facets: JSON.stringify({
            quantity: '123',
            condition: { code: 'B', description: 'B', legacyId: 2211 },
            'install-date': '2018-12-31T14:00:00.000Z',
          }),
          notes: '{}',
          images: [],
          projectId: Cypress.env('projectId'),
          siteId: Cypress.env('siteId'),
          id: virtualAssetId,
          tenantId,
          facilityId: Cypress.env('facilityId'),
          floorId: Cypress.env('floorId'),
        },
      }),
    )
  })
})

Cypress.Commands.add('createSpace', () => {
  cy.createFloor().then({ timeout: 10000 }, () => {
    const spaceId = shortid.generate()
    Cypress.env('spaceId', spaceId)

    return new Cypress.Promise((resolve, reject) => {
      API.graphql(
        graphqlOperation(CreateSpace, {
          input: {
            createdAtClient: new Date().toISOString(),
            createdBy: 'TESTING',
            name: `TESTING SPACE${spaceId}`,
            type: 'Balcony',
            status: 'IN_PROGRESS',
            id: spaceId,
            floorId: Cypress.env('floorId'),
            tenantId,
            facilityId: Cypress.env('facilityId'),
          },
        }),
      )
        .then(resolve)
        .catch(reject)
    })
  })
})

Cypress.Commands.add('createFloor', () => {
  cy.createFacility().then(() => {
    const floorId = shortid.generate()
    Cypress.env('floorId', floorId)
    return new Cypress.Promise((resolve, reject) => {
      API.graphql(
        graphqlOperation(CreateFloor, {
          input: {
            createdAtClient: new Date().toISOString(),
            createdBy: 'TESTING',
            name: `TESTING FLOOR${floorId}`,
            status: 'IN_PROGRESS',
            id: floorId,
            tenantId,
            facilityId: Cypress.env('facilityId'),
          },
        }),
      )
        .then(resolve)
        .catch(reject)
    })
  })
})

Cypress.Commands.add('getSubscribedFloorInfo', () => ({
  floorId: Cypress.env('sFloorId'),
  floorName: Cypress.env('sFloorName'),
}))

Cypress.Commands.add('createFloorInFacility', () => {
  const floorId = shortid.generate()
  Cypress.env('sFloorId', floorId)
  Cypress.env('sFloorName', `TESTING FLOOR${floorId}`)
  API.graphql(
    graphqlOperation(CreateFloor, {
      input: {
        createdAtClient: new Date().toISOString(),
        createdBy: 'TESTING',
        name: `TESTING FLOOR${floorId}`,
        status: 'IN_PROGRESS',
        id: floorId,
        tenantId,
        facilityId: Cypress.env('facilityId'),
      },
    }),
  )
})

Cypress.Commands.add('updateFloorInFacility', () => {
  const floorId = Cypress.env('floorId')
  const floorName = `TESTING FLOOR${floorId}_updated`
  Cypress.env('sFloorId', floorId)
  Cypress.env('sFloorName', floorName)
  API.graphql(
    graphqlOperation(UpdateFloor, {
      input: {
        createdAtClient: new Date().toISOString(),
        createdBy: 'TESTING',
        name: floorName,
        status: 'IN_PROGRESS',
        id: floorId,
        tenantId,
        facilityId: Cypress.env('facilityId'),
        version: 'v0002',
      },
    }),
  )
})

Cypress.Commands.add('getSubscribedSpaceInfo', () => ({
  spaceId: Cypress.env('sSpaceId'),
  spaceName: Cypress.env('sSpaceName'),
}))

Cypress.Commands.add('createSpaceInFacility', () => {
  const spaceId = shortid.generate()
  Cypress.env('sSpaceId', spaceId)
  Cypress.env('sSpaceName', `TESTING SPACE${spaceId}`)
  API.graphql(
    graphqlOperation(CreateSpace, {
      input: {
        createdAtClient: new Date().toISOString(),
        createdBy: 'TESTING',
        name: `TESTING SPACE${spaceId}`,
        type: 'Balcony',
        status: 'IN_PROGRESS',
        id: spaceId,
        floorId: Cypress.env('floorId'),
        tenantId,
        facilityId: Cypress.env('facilityId'),
      },
    }),
  )
})

Cypress.Commands.add('updateSpaceInFacility', () => {
  const spaceId = Cypress.env('spaceId')
  const spaceName = `TESTING SPACE${spaceId}_updated`
  Cypress.env('sSpaceId', spaceId)
  Cypress.env('sSpaceName', spaceName)
  API.graphql(
    graphqlOperation(UpdateSpace, {
      input: {
        createdAtClient: new Date().toISOString(),
        createdBy: 'TESTING',
        name: spaceName,
        type: 'Balcony',
        status: 'IN_PROGRESS',
        id: spaceId,
        floorId: Cypress.env('floorId'),
        tenantId,
        facilityId: Cypress.env('facilityId'),
        version: 'v0002',
      },
    }),
  )
})

Cypress.Commands.add('getSubscribedAssetInfo', () => ({
  assetId: Cypress.env('sAssetId'),
  assetType: Cypress.env('sAssetType'),
}))

Cypress.Commands.add('createAssetInFacility', () => {
  const assetId = shortid.generate()
  Cypress.env('sAssetId', assetId)
  Cypress.env('sAssetType', 'Amplifier-40456')
  API.graphql(
    graphqlOperation(CreateAsset, {
      input: {
        createdAtClient: new Date().toISOString(),
        createdBy: 'TESTING',
        assetType: {
          description: 'Amplifier',
          legacyId: 40456,
          tree: ['Access', 'Amplifier'],
          virtual: false,
        },
        facets: JSON.stringify({
          quantity: '1',
          condition: {
            code: 'B',
            description: 'B',
            legacyId: 2211,
          },
          'install-date': '2019-08-05T07:36:50.899Z',
          barcode: '610718876',
          accessibility: 'High Level (>3m)',
          'asset-status': 'Operating',
          criticality: 'Low',
          manufacturer: 'CALOREX HEAT PUMP LTD',
          model: 'degree',
          'maintenance-requirement': 'Run to Fail',
        }),
        notes: JSON.stringify({ description: 'Chiller No 3' }),
        images: [],
        projectId: Cypress.env('projectId'),
        siteId: Cypress.env('siteId'),
        id: assetId,
        tenantId,
        facilityId: Cypress.env('facilityId'),
        spaceId: Cypress.env('spaceId'),
        floorId: Cypress.env('floorId'),
      },
    }),
  )
})

Cypress.Commands.add('updateAssetInFacility', () => {
  const assetId = Cypress.env('assetId')
  Cypress.env('sAssetId', assetId)
  Cypress.env('sAssetType', 'Amplifier-40456')
  API.graphql(
    graphqlOperation(UpdateAsset, {
      input: {
        createdAtClient: new Date().toISOString(),
        createdBy: 'TESTING',
        assetType: {
          description: 'Amplifier',
          legacyId: 40456,
          tree: ['Access', 'Amplifier'],
          virtual: false,
        },
        facets: JSON.stringify({
          quantity: '1',
          condition: {
            code: 'B',
            description: 'B',
            legacyId: 2211,
          },
          'install-date': '2019-08-05T07:36:50.899Z',
          barcode: '610718876',
          accessibility: 'High Level (>3m)',
          'asset-status': 'Operating',
          criticality: 'Low',
          manufacturer: 'CALOREX HEAT PUMP LTD',
          model: 'degree',
          'maintenance-requirement': 'Run to Fail',
        }),
        notes: JSON.stringify({ description: 'Chiller No 3' }),
        images: [],
        projectId: Cypress.env('projectId'),
        siteId: Cypress.env('siteId'),
        id: assetId,
        tenantId,
        facilityId: Cypress.env('facilityId'),
        spaceId: Cypress.env('spaceId'),
        floorId: Cypress.env('floorId'),
        version: 'v0002',
      },
    }),
  )
})

Cypress.Commands.add('createFacility', () => {
  cy.createProject().then({ timeout: 10000 }, () => {
    const facilityId = shortid.generate()
    Cypress.env('facilityId', facilityId)
    return new Cypress.Promise((resolve, reject) => {
      API.graphql(
        graphqlOperation(CreateFacility, {
          input: {
            createdAtClient: new Date().toISOString(),
            createdBy: 'TESTING',
            name: `TESTING FACILITY${facilityId}`,
            rag: 'A',
            status: 'IN_PROGRESS',
            siteId: Cypress.env('siteId'),
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
            id: facilityId,
            tenantId,
            images: [],
            code: random6DigitsGenerator(),
          },
        }),
      )
        .then(resolve)
        .catch(reject)
    })
  })
})

Cypress.Commands.add('createSite', () => {
  const siteId = shortid.generate()
  Cypress.env('siteId', siteId)
  return new Cypress.Promise((resolve, reject) => {
    API.graphql(
      graphqlOperation(CreateSite, {
        input: {
          createdAtClient: new Date().toISOString(),
          createdBy: 'TESTING',
          name: `TESTING SITE${siteId}`,
          id: siteId,
          tenantId,
          postcode: 'TEST POST CODE',
          code: random6DigitsGenerator(),
        },
      }),
    )
      .then(resolve)
      .catch(reject)
  })
})

Cypress.Commands.add('createProject', () => {
  cy.createSite().then(() => {
    const projectId = shortid.generate()
    Cypress.env('projectId', projectId)
    return new Cypress.Promise((resolve, reject) => {
      API.graphql(
        graphqlOperation(CreateProject, {
          input: {
            createdAtClient: new Date().toISOString(),
            createdBy: 'TESTING',
            name: `TESTING PROJECT${projectId}`,
            preSurveyQuestionnaire: 'basic-pre-survey',
            rag: 'A',
            readonly: false,
            sites: [Cypress.env('siteId')],
            docs: [
              {
                id: 'UATProjectDocument',
                text: 'Project docs',
              },
            ],
            id: projectId,
            tenantId,
            code: random6DigitsGenerator(),
          },
        }),
      )
        .then(resolve)
        .catch(reject)
    })
  })
})

Cypress.Commands.add('createSourceSpace', () => {
  cy.createSpace().then({ timeout: 10000 }, () => {
    Cypress.env('sSpaceId', Cypress.env('spaceId'))
    Cypress.env('sFloorId', Cypress.env('floorId'))
    Cypress.env('sFacilityId', Cypress.env('facilityId'))

    API.graphql(
      graphqlOperation(CreateAsset, {
        input: {
          createdAtClient: new Date().toISOString(),
          createdBy: 'TESTING',
          assetType: {
            description: 'Amplifier',
            legacyId: 40456,
            tree: ['Access', 'Amplifier'],
            virtual: false,
          },
          facets: JSON.stringify({
            quantity: '1',
            condition: { code: 'B', description: 'B', legacyId: 2211 },
            'install-date': '2019-08-05T07:36:50.899Z',
            barcode: '610718876',
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
          projectId: Cypress.env('projectId'),
          siteId: Cypress.env('siteId'),
          id: shortid.generate(),
          tenantId,
          facilityId: Cypress.env('sFacilityId'),
          spaceId: Cypress.env('sSpaceId'),
          floorId: Cypress.env('sFloorId'),
        },
      }),
    )
    API.graphql(
      graphqlOperation(CreateAsset, {
        input: {
          createdAtClient: new Date().toISOString(),
          createdBy: 'TESTING',
          assetType: {
            description: 'Audio Visual Equipment',
            legacyId: 40457,
            tree: ['Access', 'Audio Visual Eq', 'Audio Visual Equipment'],
            virtual: false,
          },
          facets: JSON.stringify({
            quantity: '1',
            condition: { code: 'C', description: 'C', legacyId: 2212 },
            'install-date': '2019-08-05T07:36:50.899Z',
            barcode: '610718876',
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
          projectId: Cypress.env('projectId'),
          siteId: Cypress.env('siteId'),
          id: shortid.generate(),
          tenantId,
          facilityId: Cypress.env('sFacilityId'),
          spaceId: Cypress.env('sSpaceId'),
          floorId: Cypress.env('sFloorId'),
        },
      }),
    )
  })
})
