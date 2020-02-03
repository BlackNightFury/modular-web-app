import React from 'react'
import { Button, Dropdown, Icon, Menu, Card } from 'antd'
import { connect } from 'dva'
import Link from 'umi/link'
import router from 'umi/router'
import {
  makeSurveyUrl,
  toTitleCase,
  makeURL,
  getEncodedNameFromUrlEncoded,
  getConcatenatedUrl,
} from '@/services/utils'
import ContextPanelGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/ContextPanelGQLWrapper'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'
import styles from './style.scss'
import { getQAErrors, getQAWarnings } from '@/services/qa'

const ButtonGroup = Button.Group

export class ContextPanel extends React.Component {
  state = {
    selected: null,
    facilities: [],
  }

  componentDidMount() {
    this.addFavSpacesHierarchy()
  }

  componentDidUpdate(prevProps) {
    const { user, facilitiesInfo } = this.props
    if (
      user.favSpaces !== prevProps.user.favSpaces ||
      facilitiesInfo !== prevProps.facilitiesInfo
    ) {
      this.addFavSpacesHierarchy()
    }
  }

  onSelectFacility = ({ value, label }) => {
    this.setState({ selected: { value, label } })
  }

  onGo = () => {
    const { selected, facilities: facilitiesInfo } = this.state
    const { pathname, contentAreaNavigation } = this.props

    if (selected === null) return
    const searchFacilitiesInfo = facilitiesInfo.slice(1)
    const searchValue = selected.value.endsWith('_fav')
      ? selected.value.slice(0, -4)
      : selected.value

    const levels = this.searchLevel(searchFacilitiesInfo, searchValue, [])
    const surveyUrl = makeSurveyUrl(contentAreaNavigation.project, levels[0], levels[1], levels[2])
    if (surveyUrl !== pathname) {
      router.push(surveyUrl)
    }
  }

  searchLevel = (treeData, value, levels) => {
    if (Array.isArray(treeData)) {
      return treeData
        .filter(facility => facility.navUrl)
        .map(facility => this.searchLevel(facility, value, [...levels, makeURL(facility.navUrl)]))
        .filter(obj => obj && obj.length)[0]
    }
    if (treeData.value === value) {
      return levels
    }
    if (treeData.children) {
      return this.searchLevel(treeData.children, value, levels)
    }
    return []
  }

  addFavSpacesHierarchy = () => {
    const {
      user: { favSpaces },
      facilitiesInfo,
    } = this.props
    const newFacilities = [...facilitiesInfo]

    newFacilities.splice(0, 0, {
      title: 'Favorite spaces',
      value: 'favorite-spaces',
      key: 'favorite-spaces',
      selectable: false,
    })

    const { selected } = this.state
    if (favSpaces.length > 0) {
      newFacilities[0].children = favSpaces.map(space => ({
        title: space.asset.name,
        key: `${space.asset.id}_fav`,
        value: `${space.asset.id}_fav`,
        selectable: true,
      }))
    }

    const newState = { facilities: newFacilities, selected }

    if (selected && selected.value.endsWith('_fav')) {
      const facilityInfoIndex =
        favSpaces.length > 0 && newFacilities[0].children
          ? newFacilities[0].children.findIndex(facility => facility.value === selected.value)
          : -1

      if (facilityInfoIndex === -1) {
        newState.selected = null
      }
    }

    this.setState(newState)
  }

  onRunQA = () => {
    const { allRecords, onRunQA } = this.props
    onRunQA(allRecords)
  }

  onShowVirtualAssets = () => {
    const { contentAreaNavigation, history } = this.props

    history.push(
      `${makeSurveyUrl(
        contentAreaNavigation.project,
        contentAreaNavigation.facility,
        contentAreaNavigation.floor,
      )}/virtual-assets`,
    )
  }

  onCompleteFacility = () => {
    const { dispatch, history, contentAreaNavigation } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: false,
      },
    })
    history.push(
      `${makeSurveyUrl(contentAreaNavigation.project, contentAreaNavigation.facility)}/completion`,
    )
  }

  onCompleteFloor = () => {
    const { history, contentAreaNavigation } = this.props
    history.push(`${makeSurveyUrl(contentAreaNavigation.project, contentAreaNavigation.facility)}`)
  }

  renderDocLinks = docs => (
    <>
      {docs.map((doc, index) => (
        <a
          className="underline"
          key={index}
          href={`/docs/${doc.id}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          data-test-selector="contextpanel_project_docs"
        >
          {doc.text}
        </a>
      ))}
    </>
  )

  isFloorCompleted = (floorName, floors, facilityId) => {
    const filteredFloors = floors.filter(
      floor =>
        makeURL(getConcatenatedUrl(floor.id, floor.name)) === floorName &&
        floor.facilityId === facilityId,
    )
    if (filteredFloors.length) {
      return filteredFloors[0].status === 'DONE'
    }
    return false
  }

  render() {
    const {
      className,
      contentAreaNavigation,
      project: { docs: projectDocs, name: projectName },
      allRecords: { facilities, floors },
      isCompleted,
      isVAInSpace,
    } = this.props
    const { selected, facilities: facilitiesInfo } = this.state
    const facilityInfoIndex = selected
      ? facilitiesInfo.findIndex(
          facility => !!(facility.children || []).find(child => child.value === selected.value),
        )
      : -1
    const currentFacility =
      facilities.find(
        facility =>
          facility.name.toLowerCase() ===
          toTitleCase(getEncodedNameFromUrlEncoded(contentAreaNavigation.facility)).toLowerCase(),
      ) || {}
    const isSelectedFavSpace = facilityInfoIndex === 0
    const levels =
      !isSelectedFavSpace && selected ? this.searchLevel(facilitiesInfo, selected.value, []) : []

    const goMenu = (
      <Menu>
        <Menu.Item key="copy-assets">Copy assets</Menu.Item>
      </Menu>
    )

    return (
      <Card data-test-selector="context-panel" className={`${styles.contextPanel} ${className}`}>
        <div className={styles.docsContainer}>
          <h5>Project: {projectName}</h5>
          <Link
            to={`${makeSurveyUrl(
              contentAreaNavigation.project,
              contentAreaNavigation.facility,
            )}/untagged-assets`}
          >
            Untagged Assets
          </Link>
          {this.renderDocLinks(projectDocs || [])}
        </div>
        <div className={styles.docsContainer}>
          <h5>Facility: {currentFacility.name}</h5>
          {this.renderDocLinks(currentFacility.docs || [])}
        </div>
        {!isVAInSpace && contentAreaNavigation.floor && (
          <>
            <h5>Floor: {toTitleCase(contentAreaNavigation.floor)}</h5>
            {/*eslint-disable-next-line */}
            <a role="button" onClick={() => this.onShowVirtualAssets()}>
              <u>Virtual assets</u>
            </a>
            <p />
          </>
        )}
        <h5>Search the facility</h5>
        <div className={styles.row}>
          <SearchableTree
            labelInValue
            placeholder="Select"
            searchPlaceholder="Search..."
            treeData={facilitiesInfo}
            onSelect={this.onSelectFacility}
            getPopupContainer={trigger => trigger.parentNode}
            value={selected}
            data-test-selector="contextpanel_searchfacility"
          />
          <ButtonGroup className={styles.buttonGroup}>
            <Button
              className={styles.button}
              onClick={this.onGo}
              data-test-selector="contextpanel_searchfacility_go"
            >
              Go
            </Button>
            <Dropdown
              disabled={!isSelectedFavSpace && levels.length < 4}
              overlay={goMenu}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Button className={styles.secondaryButton}>
                <Icon type="down" />
              </Button>
            </Dropdown>
          </ButtonGroup>
        </div>

        <br />
        <h5>Completion Status</h5>
        <div className={styles.alert}>
          <div className={styles.error} />
          <span className={styles.alertText}>{getQAErrors().length} errors</span>
        </div>
        <div className={styles.alert}>
          <div className={styles.warning} />
          <span className={styles.alertText}>{getQAWarnings().length} warnings</span>
        </div>
        <br />

        {!isCompleted && (
          <Button
            onClick={this.onCompleteFacility}
            data-test-selector="context-panel-complete-facility"
            block
          >
            Facility journal
          </Button>
        )}
        {contentAreaNavigation.floor &&
          !this.isFloorCompleted(contentAreaNavigation.floor, floors, currentFacility.id) && (
            <Button
              onClick={this.onCompleteFloor}
              data-test-selector="context-panel-complete-facility"
              block
            >
              Complete floor
            </Button>
          )}

        <Button type="button" onClick={this.onRunQA} block>
          Run QA
        </Button>
      </Card>
    )
  }
}

const mapStateToProps = ({ user, contentAreaNavigation }) => ({
  user,
  contentAreaNavigation,
})
export default ContextPanelGQLWrapper(connect(mapStateToProps)(ContextPanel))
