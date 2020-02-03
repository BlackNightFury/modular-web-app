import React from 'react'
import BreadCrumbsComponent from './index'

class BreadcrumbsTest extends React.Component {
  render() {
    const { breadcrumbs, isSecondary } = this.props

    return <BreadCrumbsComponent breadcrumbs={breadcrumbs} isSecondary={isSecondary} isTest />
  }
}

export default BreadcrumbsTest
