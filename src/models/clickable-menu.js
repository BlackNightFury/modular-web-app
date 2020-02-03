import { getLeftMenuData, getTopMenuData } from '@/services/clickable-menu'
import { getRoles } from '@/services/user'

export default {
  namespace: 'clickablemenu',
  state: {
    menuLeftData: [],
    menuTopData: [],
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *GET_DATA({ payload }, { put, call }) {
      const { email } = payload
      const roles = getRoles(email)
      if (!roles) return
      const menuLeftData = yield call(getLeftMenuData, roles)
      const menuTopData = yield call(getTopMenuData, roles)
      yield put({
        type: 'SET_STATE',
        payload: {
          menuLeftData,
          menuTopData,
        },
      })
    },
    *GET_ADMIN_DATA(data, { put, call }) {
      const roles = ['admin']
      const menuLeftData = yield call(getLeftMenuData, roles)
      const menuTopData = yield call(getTopMenuData, roles)
      yield put({
        type: 'SET_STATE',
        payload: {
          menuLeftData,
          menuTopData,
        },
      })
    },
  },
}
