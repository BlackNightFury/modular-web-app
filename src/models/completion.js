const initialValues = {
  completedDatasPendingForNotification: [],
}

export default {
  namespace: 'completion',
  state: initialValues,
  reducers: {
    SET_STATE: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  effects: {
    *DATA_COMPLETED({ payload }, saga) {
      const { id, name } = payload
      const { completion } = window.g_app._store.getState()
      const { completedDatasPendingForNotification } = completion
      if (!completedDatasPendingForNotification.find(data => data.id === id)) {
        yield saga.put({
          type: 'SET_STATE',
          payload: {
            completedDatasPendingForNotification: [
              ...completedDatasPendingForNotification,
              { id, name, isEnabled: false },
            ],
          },
        })
      }
    },
    *DATA_COMPLETED_CARD_ENABLED({ payload }, saga) {
      const { id } = payload
      const { completion } = window.g_app._store.getState()
      const { completedDatasPendingForNotification } = completion

      const completedDataPendingItemIndex = completedDatasPendingForNotification.findIndex(
        data => data.id === id,
      )

      if (!completedDatasPendingForNotification[completedDataPendingItemIndex].isEnabled) {
        const tmpCompletedDatasPendingForNotification = [...completedDatasPendingForNotification]
        tmpCompletedDatasPendingForNotification[completedDataPendingItemIndex].isEnabled = true
        yield saga.put({
          type: 'SET_STATE',
          payload: {
            completedDatasPendingForNotification: tmpCompletedDatasPendingForNotification,
          },
        })
        setTimeout(() => {
          const { completion: newCompletion } = window.g_app._store.getState()
          const {
            completedDatasPendingForNotification: newCompletedDatasPendingForNotification,
          } = newCompletion
          window.g_app._store.dispatch({
            type: 'completion/SET_STATE',
            payload: {
              ...newCompletion,
              completedDatasPendingForNotification: newCompletedDatasPendingForNotification.filter(
                data => data.id !== id,
              ),
            },
          })
        }, 5000)
      }
    },
  },
}
