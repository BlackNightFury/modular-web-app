import React from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Card } from 'antd'
import table from './data.json'
import FacilitiesTable from '@/components/EliasMwaComponents/DataCollection/Components/FacilitiesTable'
import MessageTable from '@/components/EliasMwaComponents/DataCollection/Components/MessageTable'

class Antd extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Admin" />

        <section className="card">
          <div className="card-body">
            <Row>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
              <Col span={6}>
                <Card bordered>Widget</Card>
              </Col>
            </Row>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Active facilities</strong>
            </div>
          </div>
          <div className="card-body">
            <FacilitiesTable data={table.facilities} />
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>My messages</strong>
            </div>
          </div>
          <div className="card-body">
            <MessageTable data={table.messages} />
          </div>
        </section>
      </div>
    )
  }
}

export default Antd
