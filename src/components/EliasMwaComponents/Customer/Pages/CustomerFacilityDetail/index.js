import React from 'react'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { Storage } from 'aws-amplify'
import { Row, Col, Tabs } from 'antd'
import { Carousel } from 'react-responsive-carousel'
import Link from 'umi/link'
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api'
import { isClickablePrototype, updateStorage, loadGoogleMapScript } from '@/services/utils'
import Scan3D from '../../Components/Scan3D'
import CommonPage from '@/components/EliasMwaComponents/DataCollection/Pages/CommonPage'

import styles from './style.scss'

const { TabPane } = Tabs
const { tenants, aws, googleApiKey } = window.mwa_config

const mapStateToProps = ({ contentAreaNavigation, user, completion }) => ({
  contentAreaNavigation,
  user,
  completion,
})

@connect(mapStateToProps)
class Antd extends CommonPage {
  state = {
    tab: null,
    images: [],
    location: null,
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props
    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: { project: params.projectName, facility: params.facilityName, floor: '', space: '' },
    })

    this.updateSelectedPhotos()
    this.getLocation()
  }

  onChangeTab = newTab => {
    this.setState({ tab: newTab })
  }

  updateSelectedPhotos = () => {
    const { facility } = this.props
    const images = facility.images || []
    updateStorage(tenants[facility.tenantId], aws.project_region)
    images.forEach(image => {
      Storage.get(image.picture.key, { download: true, level: 'public' }).then(response => {
        const arrayBufferView = new Uint8Array(response.Body)
        const blob = new Blob([arrayBufferView], { type: response.ContentType })
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        image.dataUri = imageUrl
        this.setState({
          images,
        })
      })
    })
    this.setState({
      images,
    })
  }

  getLocation = async () => {
    const { facility } = this.props

    let isMapEnabled =
      facility.facets.location && facility.facets.location.lat && facility.facets.location.lon
    if (isMapEnabled) {
      this.setState({
        location: facility.facets.location,
      })
      return
    }
    isMapEnabled = !!facility.facets.postcode
    if (isMapEnabled) {
      loadGoogleMapScript(googleApiKey, () => {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: 'USA' }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              this.setState({
                location: {
                  lat: results[0].geometry.location.lat(),
                  lon: results[0].geometry.location.lng(),
                },
              })
            } else {
              this.setState({
                location: null,
              })
            }
          } else {
            this.setState({
              location: null,
            })
          }
        })
      })
      return
    }
    this.setState({
      location: null,
    })
  }

  render() {
    const {
      facility,
      site,
      numberOfAssets,
      numberOfFloors,
      numberOfSpaces,
      numberOfFacilitiesOnSite,
      numberOfSimilarFacilities,
    } = this.props
    const { images, location } = this.state
    const buildDateYear = moment(facility.facets['build-date']).year()
    const currentYear = moment().year()

    return (
      <div className={styles.customerFacilityDetail}>
        <Helmet title={facility.name} />
        <h5 className={styles.topTitle}>{facility.name}</h5>
        <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
          <TabPane tab="Facility Detail" key="1">
            <section className="card">
              <div className="card-body">
                <Row gutter={16} type="flex">
                  <Col xs={15} sm={15} md={15} lg={15} className={styles.flexColumn}>
                    <h3 className={styles.subTitle}>{facility.name}</h3>
                    <h5 className={styles.subTitleText} data-test-selector="customer-facility-type">
                      {facility.facets['facility-type']}
                    </h5>

                    <div className={styles.paragraph}>
                      <Row gutter={16} type="flex">
                        <Col md={6} lg={6} className={styles.itemLabel}>
                          Site
                        </Col>
                        <Col md={18} lg={18} className="form-drawer-content">
                          <strong>{site.name}</strong>
                        </Col>
                      </Row>
                      <Row gutter={16} type="flex">
                        <Col md={6} lg={6} className={styles.itemLabel}>
                          Location
                        </Col>
                        <Col md={18} lg={18} className="form-drawer-content">
                          <strong>
                            {facility.notes.address} {facility.facets.postcode}
                          </strong>
                          <div>
                            {facility.facets.location && facility.facets.location.lat}{' '}
                            {facility.facets.location && facility.facets.location.lon}
                          </div>
                          {facility.notes.what3words && (
                            <a
                              href={`https://what3words.com/${facility.notes.what3words}`}
                              target="_blank"
                              without
                              rel="noopener noreferrer"
                            >
                              {facility.notes.what3words}
                            </a>
                          )}
                        </Col>
                      </Row>
                    </div>

                    <div className={styles.paragraph}>
                      <Row gutter={16} type="flex">
                        <Col md={6} lg={6} className={styles.itemLabel}>
                          Contact
                        </Col>
                        <Col md={18} lg={18} className="form-drawer-content">
                          <strong>{facility.facets['contact-name']}</strong>,{' '}
                          {facility.notes['contact-job-title']}
                          {', '}
                          {facility.notes['contact-organization']}
                          <div>
                            Tel: {facility.notes['contact-telephone']}
                            {', '}
                            Mobile: {facility.notes['contact-mobile']}, Email:{' '}
                            {facility.notes['contact-email']}
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className={styles.paragraph}>
                      <Row gutter={16} type="flex">
                        <Col md={6} lg={6} className={styles.itemLabel}>
                          Assets
                        </Col>
                        <Col md={18} lg={18} className="form-drawer-content">
                          <Link
                            to={`${
                              isClickablePrototype() ? '/clickable-prototype' : ''
                            }/my-estate/assets`}
                          >
                            {facility.name}
                          </Link>
                          <Link
                            to={`${
                              isClickablePrototype() ? '/clickable-prototype' : ''
                            }/my-estate/facilities`}
                          >
                            {site.name}
                          </Link>
                        </Col>
                      </Row>
                    </div>

                    <div className={styles.paragraph}>
                      <Row gutter={16} type="flex">
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                          <Row gutter={16} type="flex">
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              Built
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong>
                                {buildDateYear} ({currentYear - buildDateYear} years)
                              </strong>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              Occupancy p/h
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong>{facility.facets['occupancy-normal']}</strong>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              Occupancy p/h peak
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong>{facility.facets['occupancy-peak']}</strong>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              Listed status
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong>{facility.facets['listed-status']}</strong>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                          <Row gutter={16} type="flex">
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              GIA &#x33A1;
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong data-test-selector="customer-facility-gia">
                                {facility.facets['facility-gia']}
                              </strong>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              Floors
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong>{numberOfFloors}</strong>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              Spaces
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong>{numberOfSpaces}</strong>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className={styles.itemLabel}>
                              Assets
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} className="form-drawer-content">
                              <strong>{numberOfAssets}</strong>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>

                    <div className={styles.sparagraph}>{facility.notes['facility-use']}</div>

                    {facility.notes['facility-overview'] && (
                      <div className={styles.sparagraph}>{facility.notes['facility-overview']}</div>
                    )}

                    <div className={styles.leftChartContainer}>
                      <Row gutter={16} type="flex">
                        <Col xs={12} sm={12} md={12} lg={12} xl={6} className={styles.chartCol}>
                          <div className={styles.chart}>
                            <div className={styles.chartLabel}>Built</div>
                            <div className={styles.chartValue}>{buildDateYear}</div>
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={6} className={styles.chartCol}>
                          <div className={styles.chart}>
                            <div className={styles.chartLabel}>floors</div>
                            <div className={styles.chartValue}>{numberOfFloors}</div>
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={6} className={styles.chartCol}>
                          <div className={styles.chart}>
                            <div className={styles.chartLabel}>spaces</div>
                            <div className={styles.chartValue}>{numberOfSpaces}</div>
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={6} className={styles.chartCol}>
                          <div className={styles.chart}>
                            <div className={styles.chartLabel}>assets</div>
                            <div className={styles.chartValue}>{numberOfAssets}</div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={9} sm={9} md={9} lg={9} className={styles.flexColumn}>
                    {images.length > 0 && (
                      <Carousel
                        infiniteLoop
                        swipeable={false}
                        showThumbs={false}
                        className={styles.photoContainer}
                      >
                        {images.map(image => (
                          <img key={image.picture.key} src={image.dataUri} alt="facility" />
                        ))}
                      </Carousel>
                    )}
                    <div className={styles.photoContainer}>
                      {location && (
                        <LoadScriptNext
                          id="script-loader"
                          googleMapsApiKey={googleApiKey}
                          loadingElement="Loading..."
                        >
                          <GoogleMap
                            id="facility-location"
                            mapContainerClassName={styles.map}
                            zoom={7}
                            center={{
                              lat: parseFloat(location.lat),
                              lng: parseFloat(location.lon),
                            }}
                            options={{ disableDefaultUI: true }}
                          >
                            <Marker
                              position={{
                                lat: parseFloat(location.lat),
                                lng: parseFloat(location.lon),
                              }}
                            />
                          </GoogleMap>
                        </LoadScriptNext>
                      )}
                    </div>
                    <div className={styles.rightChartContainer}>
                      <div>
                        <Row gutter={16} type="flex">
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} className={styles.chartCol}>
                            <div className={styles.chart}>
                              <div className={styles.chartLabel}>GIA</div>
                              <div className={styles.chartValueLarge}>
                                {facility.facets['facility-gia'] || '-'}&#x33A1;
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} className={styles.chartCol}>
                            <div className={styles.chart}>
                              <div className={styles.chartLabel}>backlog</div>
                              <div className={styles.chartValueLarge}>£123,800</div>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} className={styles.chartCol}>
                            <div className={styles.chart}>
                              <div className={styles.chartLabel}>rating</div>
                              <div className={styles.chartValueLarge}>3,330</div>
                              <div className={styles.chartUnit}>KW</div>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} className={styles.chartCol}>
                            <div className={styles.chart}>
                              <div className={styles.chartLabel}>refridgerant</div>
                              <div className={styles.chartValueLarge}>2,125</div>
                              <div className={styles.chartUnit}>kg</div>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} className={styles.chartCol}>
                            <div className={styles.chartSmall}>
                              <div className={styles.chartLabel}>
                                facilities on site{' '}
                                <span className={styles.chartValueSmall}>
                                  {numberOfFacilitiesOnSite}
                                </span>
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={12} className={styles.chartCol}>
                            <div className={styles.chartSmall}>
                              <div className={styles.chartLabel}>
                                similar in estate{' '}
                                <span className={styles.chartValueSmall}>
                                  {numberOfSimilarFacilities}
                                </span>
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
          {/* <TabPane tab="Dashboard" key="2">
            <section className="card">
              <div className="card-body">Content of Tab Pane 2</div>
            </section>
          </TabPane> */}
          <TabPane tab="3D scan" key="3">
            <section className={`card ${styles.scan3D}`}>
              <Scan3D />
            </section>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Antd
