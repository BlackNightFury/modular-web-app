import React from 'react'
import { Helmet } from 'react-helmet'
import TopBar from '../Navigation/TopBar'
import { cartesianProductOf } from '@/services/menu'

const facilities = ['Facility', 'Long Facility Name Test Bigger than']
const floors = ['Floor', 'Long Floor Name Test Bigger than']
const spaces = ['Space', 'Long Space Name Test Bigger than']
class TestPage extends React.Component {
  getPermutations = () => {
    const results = []
    const currentPermutation = []
    cartesianProductOf([facilities, floors, spaces], results, 0, currentPermutation)
    return results
  }

  render() {
    return (
      <div>
        <Helmet title="Test Page" />
        <div className="d-sm-none">xs</div>
        <div className="d-none d-sm-block d-md-none">sm</div>
        <div className="d-none d-md-block d-lg-none">md</div>
        <div className="d-none d-lg-block d-xl-none">lg</div>
        <div className="d-none d-xl-block">xl</div>
        {this.getPermutations().map((breadcrumbs, index) => (
          <TopBar key={`topbar_${index}`} breadcrumbs={breadcrumbs} isTest isSecondary />
        ))}
      </div>
    )
  }
}

export default TestPage
