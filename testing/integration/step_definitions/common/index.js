import React from 'react'
import { Provider } from 'react-redux'
import { mount, shallow } from 'enzyme'

export const mountWithProvider = children =>
  mount(<Provider store={global.store}>{children}</Provider>)
export const shallowWithProvider = children =>
  shallow(<Provider store={global.store}>{children}</Provider>)
