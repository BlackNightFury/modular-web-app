import React from 'react'
import { IntlProvider, intlShape } from 'react-intl'
import { mount } from 'enzyme'
import { _setIntlObject } from 'umi-plugin-locale/src/locale'
import messages from '@/locales/en-US'

const intlProvider = new IntlProvider({ locale: 'en-US', messages }, {})
const { intl } = intlProvider.getChildContext()

const nodeWithIntlProp = node => {
  _setIntlObject(intl)
  return React.cloneElement(node, { intl })
}

export const mountWithIntl = (node, { context, childContextTypes } = {}) =>
  mount(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes),
  })

export default {}
