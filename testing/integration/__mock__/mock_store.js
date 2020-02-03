/* eslint import/no-unresolved: 0*/
// Needed because the two imports below have node_modules in them for some reason

import configureStore from 'redux-mock-store'
import 'node_modules/jsdom-global/register'
import 'node_modules/mock-local-storage'

import { basicPreSurvey, completeFacility, completeSite, testForm } from './forms'

export const mockStore = configureStore()
export const initialState = {}

window.mwa_config = {
  aws: {
    project_region: 'eu-west-2'
  },
  tenants: {
    admin: null,
  },
  adalConfig: {
    tenant: null,
  },
  forms: {
    'basic-pre-survey': basicPreSurvey,
    'complete-facility': completeFacility,
    'complete-site': completeSite,
    'test-form': testForm,
  },
}

const normalizedPath = require('path').join(__dirname, '../../../src/models')
require('fs')
  .readdirSync(normalizedPath)
  .forEach(file => {
    if (file.split('.').pop() === 'js') {
      const model = require(`../../../src/models/${file}`)
      initialState[model.default.namespace] = model.default.state
    }
  })

const store = mockStore(initialState)

global.store = store

export default store
