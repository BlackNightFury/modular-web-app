import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import BreadCrumbsComponent from './index'
import { toTitleCase, getEncodedNameFromUrlEncoded } from '@/services/utils'

const urlencode = require('urlencode')

const routes = [
  { path: '/clickable-prototype/admin/home', breadcrumb: 'Home' },
  { path: '/clickable-prototype/data-collection/home', breadcrumb: 'Home' },
  { path: '/clickable-prototype/home', breadcrumb: 'Home' },
  { path: '/clickable-prototype/messaging', breadcrumb: 'Message' },
  { path: '/clickable-prototype/settings', breadcrumb: 'Settings' },
  { path: '/clickable-prototype/my-estate', breadcrumb: 'My Estate' },
  {
    path: '/clickable-prototype/data-collection/:project/facilities/:facility',
    breadcrumb: ({ match }) => toTitleCase(urlencode.decode(match.params.facility)),
  },
  {
    path: '/clickable-prototype/data-collection/:project/facilities/:facility/completion',
    breadcrumb: 'Completion',
  },
  {
    path: '/clickable-prototype/data-collection/:project/facilities/:facility/floors/:floor',
    breadcrumb: ({ match }) => toTitleCase(getEncodedNameFromUrlEncoded(match.params.floor)),
  },
  {
    path:
      '/clickable-prototype/data-collection/:project/facilities/:facility/floors/:floor/virtual-assets',
    breadcrumb: 'Virtual assets',
  },
  {
    path:
      '/clickable-prototype/data-collection/:project/facilities/:facility/floors/:floor/spaces/:space',
    breadcrumb: ({ match }) => toTitleCase(getEncodedNameFromUrlEncoded(match.params.space)),
  },
  { path: '/data-collection/home', breadcrumb: 'Home' },
  {
    path: '/data-collection/:project/facilities/:facility',
    breadcrumb: ({ match }) => toTitleCase(urlencode.decode(match.params.facility)),
  },
  {
    path: '/data-collection/:project/facilities/:facility/completion',
    breadcrumb: 'Completion',
  },
  {
    path: '/data-collection/:project/facilities/:facility/floors/:floor',
    breadcrumb: ({ match }) => toTitleCase(getEncodedNameFromUrlEncoded(match.params.floor)),
  },
  {
    path: '/data-collection/:project/facilities/:facility/untagged-assets',
    breadcrumb: 'Untagged Assets',
  },
  {
    path: '/data-collection/:project/facilities/:facility/floors/:floor/virtual-assets',
    breadcrumb: 'Virtual assets',
  },
  {
    path: '/data-collection/:project/facilities/:facility/floors/:floor/spaces/:space',
    breadcrumb: ({ match }) => toTitleCase(getEncodedNameFromUrlEncoded(match.params.space)),
  },
  // Customer breadcrubm items
  {
    path: '/my-estate',
    breadcrumb: () => 'My Estate',
  },
  {
    path: '/my-estate/assets',
    breadcrumb: () => 'Assets',
  },
  {
    path: '/my-estate/facilities',
    breadcrumb: () => 'Facilities',
  },
  {
    path: '/my-estate/:project/facilities/:facility',
    breadcrumb: ({ match }) => toTitleCase(getEncodedNameFromUrlEncoded(match.params.facility)),
  },
  {
    path: '/analytics',
    breadcrumb: () => 'Analytics',
  },
  {
    path: '/analytics/asset-replacement',
    breadcrumb: () => 'Asset Replacement Cost',
  },
  {
    path: '/analytics/lifecycle-and-replacement',
    breadcrumb: () => 'Lifecycle And Replacement Costs Dashboard',
  },
  {
    path: '/analytics/asset-management',
    breadcrumb: () => 'Asset Management Dashboard',
  },
  {
    path: '/clickable-prototype/my-estate',
    breadcrumb: () => 'My Estate',
  },
  {
    path: '/clickable-prototype/my-estate/assets',
    breadcrumb: () => 'Assets',
  },
  {
    path: '/clickable-prototype/analytics',
    breadcrumb: () => 'Analytics',
  },
  {
    path: '/clickable-prototype/analytics/asset-replacement',
    breadcrumb: () => 'Asset Replacement Cost',
  },
  {
    path: '/clickable-prototype/analytics/lifecycle-and-replacement',
    breadcrumb: () => 'Lifecycle And Replacement Costs Dashboard',
  },
]
@withBreadcrumbs(routes, { disableDefaults: true })
class Breadcrumbs extends React.Component {
  render() {
    const { breadcrumbs, store } = this.props

    return <BreadCrumbsComponent breadcrumbs={breadcrumbs} store={store} />
  }
}

export default Breadcrumbs
