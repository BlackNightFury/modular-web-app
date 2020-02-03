import React from 'react'
import { connect } from 'dva'
import {
  makeSurveyUrl,
  makeURL,
  getConcatenatedUrl,
  getEncodedNameFromUrlEncoded,
} from '@/services/utils'
import ContextPanelGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/ContextPanelGQLWrapper'
import CompleteFloorDrawer from '@/components/EliasMwaComponents/DataCollection/Components/CompleteFloorDrawer'
import EditSpaceDrawer from '@/components/EliasMwaComponents/DataCollection/Components/EditSpaceDrawer'
import { renderItemWithChildren, renderDocLinks } from '../Common'
import { checkIfFacilityCompleted } from '@/services/completion'
import styles from './style.scss'

class MyWorkModule extends React.Component {
  state = {
    selectedSpace: {},
    isEditingSpace: false,
    isCompleteFloor: false,
  }

  onRunQA = () => {
    const { allRecords, onRunQA } = this.props
    onRunQA(allRecords)
  }

  onShowVirtualAssets = () => {
    const { contentAreaNavigation, history, closeContextPanelOnSmallDevices } = this.props

    history.push(
      `${makeSurveyUrl(
        contentAreaNavigation.project,
        contentAreaNavigation.facility,
        contentAreaNavigation.floor,
      )}/virtual-assets`,
    )
    closeContextPanelOnSmallDevices()
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

  onCloseEditingSpace = () => {
    this.setState({ isEditingSpace: false }) // eslint-disable-line react/no-unused-state
  }

  onConfirmSpaceChange = row => {
    const { onUpdateSpace } = this.props
    onUpdateSpace(row)
    this.setState({ isEditingSpace: false }) // eslint-disable-line react/no-unused-state
  }

  onCompleteFloorPressed = floor => {
    const {
      onUpdateFloor,
      history,
      contentAreaNavigation,
      closeContextPanelOnSmallDevices,
    } = this.props
    onUpdateFloor(floor, true)
    this.setState({ isCompleteFloor: false })

    history.push(`${makeSurveyUrl(contentAreaNavigation.project, contentAreaNavigation.facility)}`)
    closeContextPanelOnSmallDevices()
  }

  onShowCompleteFloor = () => {
    this.setState({ isCompleteFloor: true })
  }

  onCloseCompleteFloor = () => {
    this.setState({ isCompleteFloor: false })
  }

  onSelectSpace = item => {
    this.setState({ selectedSpace: { ...item }, isEditingSpace: true }) // eslint-disable-line react/no-unused-state
  }

  render() {
    const {
      contentAreaNavigation,
      project: { docs: projectDocs },
      currentFacility,
      currentFloor,
      allRecords: { facilities, floors, formResponses },
      isVAInSpace,
      spaceTypes,
      mandatoryTypes,
      treeData,
      readOnly,
      readOnlyReason,
      closeContextPanelOnSmallDevices,
    } = this.props

    const { selectedSpace, isEditingSpace, isCompleteFloor } = this.state

    const facilityChildren = currentFacility && [
      ...(currentFacility.docs || []).map(doc => ({
        ...doc,
        type: 'download',
        color: 'battleshipGrey',
        testSelector: `${doc.id}_downloadlink`,
      })),
      {
        type: 'internal-link',
        icon: 'tag',
        text: 'Untagged assets',
        color: 'slateGrey',
        to: `${makeSurveyUrl(
          contentAreaNavigation.project,
          contentAreaNavigation.facility,
        )}/untagged-assets`,
        onClick: closeContextPanelOnSmallDevices,
        testSelector: 'untaggedassets_facility',
      },
    ]

    const floorChildren = []

    if (!isVAInSpace) {
      floorChildren.push({
        type: 'internal-link',
        icon: 'bulb',
        text: 'Virtual assets',
        color: 'slateGrey',
        to: `${makeSurveyUrl(
          contentAreaNavigation.project,
          contentAreaNavigation.facility,
          contentAreaNavigation.floor,
        )}/virtual-assets`,
        onClick: closeContextPanelOnSmallDevices,
        testSelector: 'virtualassets_link',
      })
    }

    return (
      <>
        {contentAreaNavigation.project && (
          <div className={styles.detailContainer}>
            <div className={styles.row}>{renderDocLinks(projectDocs || [])}</div>
          </div>
        )}
        {contentAreaNavigation.facility &&
          renderItemWithChildren(currentFacility.name, 'bank', 'facility_link', facilityChildren, {
            text: 'Facility journal',
            onClick: this.onCompleteFacility,
            testSelector: 'context-panel-complete-facility',
            hide: checkIfFacilityCompleted(
              formResponses,
              facilities,
              makeURL(getEncodedNameFromUrlEncoded(contentAreaNavigation.facility)),
            ),
          })}
        {contentAreaNavigation.floor &&
          renderItemWithChildren(
            currentFloor.name,
            'scan',
            'floor_link',
            floorChildren,
            !this.isFloorCompleted(contentAreaNavigation.floor, floors, currentFacility.id) && {
              text: 'Complete floor',
              onClick: this.onShowCompleteFloor,
              testSelector: 'context-panel-complete-floor',
            },
          )}

        {/* {contentAreaNavigation.space &&
          renderItemWithChildren(currentSpace.name, 'border', 'space_link', spaceChildren)}
        {contentAreaNavigation.asset &&
          renderItemWithChildren(currentAsset.name, 'barcode', 'asset_link', assetChildren)} */}

        <EditSpaceDrawer
          visible={isEditingSpace}
          item={selectedSpace}
          spaceTypes={spaceTypes}
          onClose={this.onCloseEditingSpace}
          onConfirm={this.onConfirmSpaceChange}
          readOnly={readOnly}
          readOnlyReason={readOnlyReason}
        />

        <CompleteFloorDrawer
          visible={isCompleteFloor}
          item={currentFloor}
          mandatoryTypes={mandatoryTypes}
          treeData={treeData}
          onClose={this.onCloseCompleteFloor}
          onSelectSpace={this.onSelectSpace}
          onCompleteFloor={this.onCompleteFloorPressed}
        />
      </>
    )
  }
}

const mapStateToProps = ({ contentAreaNavigation }) => ({
  contentAreaNavigation,
})
export default ContextPanelGQLWrapper(connect(mapStateToProps)(MyWorkModule))
