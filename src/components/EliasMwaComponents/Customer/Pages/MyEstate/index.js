import React from 'react'
import { Helmet } from 'react-helmet'
import EstateTable from '@/components/EliasMwaComponents/Customer/Components/EstateTable'
import data from './data.json'

class Antd extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="My Estate" />
        <section className="card">
          <div className="card-header">
            <img src="/resources/images/google-map.png" alt="google map" width="100%" />
          </div>
          <div className="card-body">
            <EstateTable data={data.estate} />
          </div>
        </section>
      </div>
    )
  }
}

export default Antd
