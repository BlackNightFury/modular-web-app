import {
  listEliasInfo,
  tenantId,
  hierarchy,
  virtualHierarchy,
  spaceTypes,
  mandatoryTypes,
} from './dummy-data.json'

const { facilityConditionSurveyHierarchy } = window.mwa_config

export default {
  namespace: 'prototype',
  state: {
    listEliasInfo: {
      ...listEliasInfo,
      listConditionSurveyData: facilityConditionSurveyHierarchy,
    },
    tenantId,
    spaceTypes,
    hierarchy,
    virtualHierarchy,
    mandatoryTypes,
  },
  reducers: {
    SET_STATE: (state, { payload }) => ({ ...state, ...payload }),
  },
  effects: {
    *ADD_ASSET({ payload }, saga) {
      const { asset, type } = payload
      const {
        prototype: { listEliasInfo: data },
      } = yield saga.select()
      const newListEliasInfo = { ...data }
      newListEliasInfo[type] = { items: [asset, ...newListEliasInfo[type].items] }

      yield saga.put({
        type: 'SET_STATE',
        payload: {
          listEliasInfo: newListEliasInfo,
        },
      })
    },
    *UPDATE_TREE_DATA({ payload }, saga) {
      const { newData, type } = payload
      const {
        prototype: { listEliasInfo: data },
      } = yield saga.select()
      const newListEliasInfo = { ...data }

      newListEliasInfo[type] = newData

      yield saga.put({
        type: 'SET_STATE',
        payload: {
          listEliasInfo: newListEliasInfo,
        },
      })
    },
    *UPDATE_ASSET({ payload }, saga) {
      const { asset, type } = payload
      const {
        prototype: { listEliasInfo: data },
      } = yield saga.select()
      const newListEliasInfo = { ...data }

      const updatedIndex = newListEliasInfo[type].items.findIndex(post => post.id === asset.id)

      newListEliasInfo[type].items[updatedIndex] = asset

      newListEliasInfo[type] = { items: [...newListEliasInfo[type].items] }

      yield saga.put({
        type: 'SET_STATE',
        payload: {
          listEliasInfo: newListEliasInfo,
        },
      })
    },
    *DELETE_ASSET({ payload }, saga) {
      const { asset, type } = payload
      const {
        prototype: { listEliasInfo: data },
      } = yield saga.select()

      const newListEliasInfo = { ...data }
      newListEliasInfo[type] = {
        items: newListEliasInfo[type].items.filter(post => post.id !== asset.id),
      }

      yield saga.put({
        type: 'SET_STATE',
        payload: {
          listEliasInfo: newListEliasInfo,
        },
      })
    },
  },
  subscriptions: {},
}
