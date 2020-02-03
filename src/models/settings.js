import store from 'store'

const STORED_SETTINGS = storedSettings => {
  const settings = {}
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

export default {
  namespace: 'settings',
  state: {
    ...STORED_SETTINGS({
      isMobileView: false,
      isMediumView: false,
      screenSize: 'lg',
      isMobileMenuOpen: false,
      isLightTheme: true,
      isSettingsOpen: false,
      isMenuTop: false,
      isMenuCollapsed: false,
      isBorderless: true,
      isSquaredBorders: false,
      isFixedWidth: false,
      isMenuShadow: true,
      contextPanelActiveKey: null,
    }),
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *CHANGE_SETTING(
      {
        payload: { setting, value },
      },
      { put },
    ) {
      yield store.set(`app.settings.${setting}`, value)
      yield put({
        type: 'SET_STATE',
        payload: {
          [setting]: value,
        },
      })
    },
  },
  subscriptions: {
    setup: ({ dispatch, history }) => {
      // load settings from url on app load
      history.listen(params => {
        const { query } = params
        Object.keys(query).forEach(key => {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: key,
              value: query[key] === 'true',
            },
          })
        })
      })

      // detect isMobileView setting on app load and window resize
      const isMobileView = (load = false) => {
        const currentState = global.window.innerWidth < 768
        const prevState = store.get('app.settings.isMobileView')
        if (currentState !== prevState || load) {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: 'isMobileView',
              value: currentState,
            },
          })
        }
      }

      const isMediumView = (load = false) => {
        const currentState = global.window.innerWidth < 992
        const prevState = store.get('app.settings.isMediumView')
        if (currentState !== prevState || load) {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: 'isMediumView',
              value: currentState,
            },
          })
        }
      }

      const checkScreenSize = (load = false) => {
        let currentState
        const prevState = store.get('app.settings.screenSize')
        if (global.window.innerWidth >= 1200) {
          currentState = 'xl'
        } else if (global.window.innerWidth >= 992) {
          currentState = 'lg'
        } else if (global.window.innerWidth >= 768) {
          currentState = 'md'
        } else if (global.window.innerWidth >= 576) {
          currentState = 'sm'
        } else {
          currentState = 'xs'
        }

        if (currentState !== prevState || load) {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: 'screenSize',
              value: currentState,
            },
          })
        }
      }
      window.addEventListener('resize', () => {
        isMobileView()
        isMediumView()
        checkScreenSize()
      })
      isMobileView(true)
      isMediumView(true)
      checkScreenSize(true)
    },
  },
}
