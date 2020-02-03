import React from 'react'
import { connect } from 'dva'
import Link from 'umi/link'
import { Helmet } from 'react-helmet'
import { Row, Col, Tabs } from 'antd'
import { Carousel } from 'react-responsive-carousel'
import { Storage } from 'aws-amplify'
import CommonPage from '@/components/EliasMwaComponents/DataCollection/Pages/CommonPage'
import { updateStorage, makeCustomerUrl } from '@/services/utils'

import styles from './style.scss'
import { ListAssets } from '@/graphql/queries'
import { formatNumber } from '@/utils/charts'

const { TabPane } = Tabs
const { aws } = window.mwa_config

const mapStateToProps = ({ contentAreaNavigation, user, completion }) => ({
  contentAreaNavigation,
  user,
  completion,
})

@connect(mapStateToProps)
class Antd extends CommonPage {
  state = {
    tab: null,
    carouselImages: [],
    similiarInEstate: 0,
    similiarInFacility: 0,
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
      asset: { images },
    } = this.props

    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: {
        project: params.projectName,
        facility: params.facilityName,
        floor: params.floorName,
        space: params.spaceName,
        asset: params.assetName,
      },
    })

    this.updateCarouselImages(images)
  }

  onChangeTab = newTab => {
    this.setState({ tab: newTab })
  }

  updateCarouselImages = images => {
    const {
      user: { currentTenant },
    } = this.props

    const newImages = images || []
    updateStorage(currentTenant, aws.project_region)
    newImages.forEach(image => {
      Storage.get(image.picture.key, { download: true, level: 'public' })
        .then(response => {
          const arrayBufferView = new Uint8Array(response.Body)
          const blob = new Blob([arrayBufferView], { type: response.ContentType })
          const urlCreator = window.URL || window.webkitURL
          const imageUrl = urlCreator.createObjectURL(blob)
          image.dataUri = imageUrl
          this.setState({
            carouselImages: newImages,
          })
        })
        .catch(() => {})
    })
    this.setState({
      carouselImages: newImages,
    })
  }

  async componentDidUpdate(prevProps) {
    const {
      asset,
      user: { tenantId },
      isDemo,
    } = this.props
    if (prevProps.asset !== asset && !isDemo) {
      const res1 = await window.appsyncClient.query({
        query: ListAssets,
        variables: {
          tenantId,
          assetType: {
            description: asset.assetType.description,
            legacyId: asset.assetType.legacyId,
            virtual: asset.assetType.virtual,
          },
        },
        fetchPolicy: 'network-only',
      })
      const res2 = await window.appsyncClient.query({
        query: ListAssets,
        variables: {
          tenantId,
          facilityId: asset.facilityId,
          assetType: {
            description: asset.assetType.description,
            legacyId: asset.assetType.legacyId,
            virtual: asset.assetType.virtual,
          },
        },
        fetchPolicy: 'network-only',
      })

      this.setState({
        similiarInFacility: res2.data.listAssets && res2.data.listAssets.items.length - 1,
        similiarInEstate: res1.data.listAssets && res1.data.listAssets.items.length - 1,
      })
    }
  }

  render() {
    const {
      asset: {
        assetType,
        notes: { notes, condition },
        facets: {
          manufacturer,
          model,
          criticality,
          accessibility,
          rating,
          'serial-number': serialNumber,
          'asset-status': assetStatus,
          'install-date': installDate,
          'maintenance-requirement': maintenanceRequirement,
        },
        spons: { lifecycle, totalReplacementCost, eol },
      },
      project,
      facility,
      floor,
      space,
    } = this.props
    const { carouselImages, similiarInFacility, similiarInEstate } = this.state
    const assetImages = carouselImages.map((image, index) => (
      <div key={index}>
        <img src={image.dataUri} alt="img" />
      </div>
    ))

    return (
      <div className={styles.customerFacilityDetail}>
        <Helmet title={`${assetType.description} - ${assetType.legacyId}`} />
        <h5 className={styles.topTitle}>
          {assetType.description} - {assetType.legacyId}
        </h5>
        <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
          <TabPane tab="Asset Detail" key="1">
            <section className="card">
              <div className="card-body">
                <Row gutter={16} type="flex">
                  <Col xs={15} sm={15} md={15} lg={15} className={styles.flexColumn}>
                    <h3 className={styles.subTitle}>
                      {assetType.description} - {assetType.legacyId}
                    </h3>
                    <h5 className={styles.subTitleText}>{assetType.description} 1</h5>

                    <div className={styles.paragraph}>
                      <Row gutter={16} type="flex">
                        <Col md={6} lg={6} className={styles.itemLabel}>
                          Asset tag ID
                        </Col>
                        <Col md={18} lg={18} className="form-drawer-content">
                          <strong>{assetType.legacyId}</strong>
                        </Col>
                      </Row>
                    </div>

                    <div className={styles.paragraph}>
                      {model && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Model
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{model}</strong>
                          </Col>
                        </Row>
                      )}
                      {manufacturer && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Manufacturer
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{manufacturer}</strong>
                          </Col>
                        </Row>
                      )}
                      {serialNumber && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Serial Number
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{serialNumber}</strong>
                          </Col>
                        </Row>
                      )}
                    </div>

                    <div className={styles.paragraph}>
                      {criticality && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Criticality
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{criticality}</strong>
                          </Col>
                        </Row>
                      )}{' '}
                      {maintenanceRequirement && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Maintenance req
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{maintenanceRequirement}</strong>
                          </Col>
                        </Row>
                      )}
                      {assetStatus && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Asset Status
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{assetStatus}</strong>
                          </Col>
                        </Row>
                      )}
                      {installDate && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Install Date
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{new Date(installDate).getFullYear()}</strong>
                          </Col>
                        </Row>
                      )}
                      {lifecycle && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Lifecycle period
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{lifecycle}</strong>
                          </Col>
                        </Row>
                      )}
                      {eol && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            End of service life
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{eol} (estimated)</strong>
                          </Col>
                        </Row>
                      )}
                    </div>

                    <div className={styles.paragraph}>
                      {condition && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Condition
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{condition}</strong>
                          </Col>
                        </Row>
                      )}
                      {notes && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Notes
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{notes}</strong>
                          </Col>
                        </Row>
                      )}
                      {accessibility && (
                        <Row gutter={16} type="flex">
                          <Col md={6} lg={6} className={styles.itemLabel}>
                            Accessibility
                          </Col>
                          <Col md={18} lg={18} className="form-drawer-content">
                            <strong>{accessibility}</strong>
                          </Col>
                        </Row>
                      )}
                    </div>

                    <div className={styles.paragraph}>
                      <Row gutter={16} type="flex">
                        <Col md={6} lg={6} className={styles.itemLabel}>
                          Location
                        </Col>
                        <Col md={18} lg={18} className="form-drawer-content">
                          <div>{space}</div>
                          <div>{floor}</div>
                          <Link to={makeCustomerUrl(project, facility)}>{facility}</Link>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={9} sm={9} md={9} lg={9} className={styles.flexColumn}>
                    <Carousel
                      infiniteLoop
                      swipeable={false}
                      showThumbs={false}
                      className={styles.photoContainer}
                    >
                      {assetImages}
                    </Carousel>
                    <div className={styles.rightChartContainer}>
                      <div>
                        <Row gutter={16} type="flex">
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className={styles.chartCol}>
                            <div className={styles.chart}>
                              <div className={styles.chartLabel}>Replacement</div>
                              <div className={styles.chartValueLarge}>
                                £{formatNumber(totalReplacementCost)}
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className={styles.chartCol}>
                            <div className={styles.chart}>
                              <div className={styles.chartLabel}>Rating</div>
                              {rating ? (
                                <>
                                  <div
                                    className={styles.chartValue}
                                    data-test-selector="customer_asset_details_rating"
                                  >
                                    {rating}
                                  </div>
                                  <div className={styles.chartUnit}>KW</div>
                                </>
                              ) : (
                                <div
                                  className={styles.chartValue}
                                  data-test-selector="customer_asset_details_rating"
                                >
                                  -
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.chartCol}>
                            <div className={styles.chartSmall}>
                              <div className={styles.chartLabel}>
                                Similar in facility{' '}
                                <span className={styles.chartValueSmall}>{similiarInFacility}</span>
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.chartCol}>
                            <div className={styles.chartSmall}>
                              <div className={styles.chartLabel}>
                                Similar in estate{' '}
                                <span className={styles.chartValueSmall}>{similiarInEstate}</span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </section>
          </TabPane>
          <TabPane tab="Instruction" key="2">
            <section className="card">
              <div className="card-body">Content of Tab Pane 2</div>
            </section>
          </TabPane>
          <TabPane tab="Service times" key="3">
            <section className="card">
              <div className="card-body">Content of Tab Pane 3</div>
            </section>
          </TabPane>
          <TabPane tab="Legislation" key="4">
            <section className="card">
              <div className="card-body">Content of Tab Pane 4</div>
            </section>
          </TabPane>
          <TabPane tab="History" key="5">
            <section className="card">
              <div className="card-body">Content of Tab Pane 5</div>
            </section>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Antd
