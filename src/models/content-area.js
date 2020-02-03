const initialValues = {
  project: '',
  facility: '',
  floor: '',
  space: '',
}

export default {
  namespace: 'contentAreaNavigation',
  state: initialValues,
  reducers: {
    SET_STATE: (state, { payload }) => ({ ...state, ...payload }),
  },
}
