import { getLeftMenuData, getTopMenuData } from '@/services/menu'

export default {
  namespace: 'menu',
  state: {
    menuLeftData: [],
    menuTopData: [],
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *GET_DATA(action, { put, call }) {
      const menuLeftData = yield call(getLeftMenuData)
      const menuTopData = yield call(getTopMenuData)
      yield put({
        type: 'SET_STATE',
        payload: {
          menuLeftData,
          menuTopData,
        },
      })
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'GET_DATA',
      })
    },
  },
}
