import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Menu, Icon, Button, Dropdown } from 'antd'
import {
  makeSurveyUrl,
  makeURL,
  getConcatenatedUrl,
  findDetailsFromHierarchyTree,
  makeHierarchyTree,
} from '@/services/utils'
import ContextPanelGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/ContextPanelGQLWrapper'
import SearchableTree from '@/components/EliasMwaComponents/Host/SearchableTree'
import CopyAssetsDrawer from '@/components/EliasMwaComponents/DataCollection/Components/CopyAssetsDrawer'
import { renderItemWithInfo } from '../Common'
import styles from './style.scss'
import { makeCopyAsset } from '@/services/asset'

const ButtonGroup = Button.Group

class SearchModule extends React.Component {
  state = {
    selected: null,
    facilities: [],
    isCopying: false,
    copyAssets: [],
    copyFrom: '',
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
    const {
      pathname,
      allRecords: { projects, facilities },
      closeContextPanelOnSmallDevices,
    } = this.props

    if (selected === null) return
    const searchFacilitiesInfo = facilitiesInfo.slice(1)
    const searchValue = selected.value.endsWith('_fav')
      ? selected.value.slice(0, -4)
      : selected.value
    const levels = this.searchLevel(searchFacilitiesInfo, searchValue, [])
    const facility = facilities.find(item => item.id === levels[0].id)
    const project = projects.find(item => item.sites.find(site => site === facility.siteId))
    const surveyUrl = makeSurveyUrl(
      getConcatenatedUrl(project.code || 'null', project.name),
      getConcatenatedUrl(facility.code || 'null', facility.name),
      levels[1] ? getConcatenatedUrl(levels[1].id, levels[1].name) : undefined,
      levels[2] ? getConcatenatedUrl(levels[2].id, levels[2].name) : undefined,
    )
    if (surveyUrl !== pathname) {
      router.push(surveyUrl)
    }
    closeContextPanelOnSmallDevices()
  }

  searchLevel = (treeData, value, levels) => {
    if (Array.isArray(treeData)) {
      return treeData
        .map(facility =>
          this.searchLevel(facility, value, [
            ...levels,
            { id: facility.id, name: makeURL(facility.title) },
          ]),
        )
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

  onMenuClick = event => {
    if (event.key === 'copy-assets') {
      const { selected } = this.state
      const {
        allRecords: { assets },
      } = this.props

      const searchValue = selected.value.endsWith('_fav')
        ? selected.value.slice(0, -4)
        : selected.value

      const filterAssets = assets.filter(asset => asset.spaceId === searchValue)
      this.setState({ isCopying: true, copyAssets: filterAssets, copyFrom: selected.label })
    }
  }

  onCloseCopying = () => {
    this.setState({ isCopying: false, copyAssets: [] })
  }

  onCopy = assets => {
    const {
      dispatch,
      history,
      contentAreaNavigation,
      treeData,
      closeContextPanelOnSmallDevices,
    } = this.props
    const { copyFrom } = this.state
    const hierarchyTree = makeHierarchyTree(treeData, true, true)
    const copyAssets = assets.map(asset => {
      const { facets } = findDetailsFromHierarchyTree(asset.type, hierarchyTree)
      const newAsset = makeCopyAsset(asset, facets)
      return newAsset
    })

    if (copyAssets.length) {
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          assetCopy: {
            copyAssets,
            completed: false,
            copyFrom,
          },
        },
      })
      history.push(
        `${makeSurveyUrl(
          contentAreaNavigation.project,
          contentAreaNavigation.facility,
          contentAreaNavigation.floor,
          contentAreaNavigation.space,
        )}/copy-assets`,
      )
      closeContextPanelOnSmallDevices()
    }
  }

  goToAssetPage = () => {
    const {
      user: { authenticatedBy },
      dispatch,
      closeContextPanelOnSmallDevices,
    } = this.props
    router.push(`${authenticatedBy === 'demo' ? '/clickable-prototype' : ''}/my-estate/assets`)
    dispatch({
      type: 'contentAreaNavigation/SET_STATE',
      payload: {
        project: '',
        facility: '',
        floor: '',
        space: '',
        asset: '',
      },
    })
    closeContextPanelOnSmallDevices()
  }

  render() {
    const {
      contentAreaNavigation,
      allRecords: { assets },
      isCustomer,
    } = this.props
    const { selected, facilities: facilitiesInfo, isCopying, copyAssets } = this.state
    const facilityInfoIndex = selected
      ? facilitiesInfo.findIndex(
          facility => !!(facility.children || []).find(child => child.value === selected.value),
        )
      : -1

    const isSelectedFavSpace = facilityInfoIndex === 0
    const levels =
      !isSelectedFavSpace && selected ? this.searchLevel(facilitiesInfo, selected.value, []) : []

    const goMenu = (
      <Menu onClick={e => this.onMenuClick(e)}>
        {contentAreaNavigation.space && <Menu.Item key="copy-assets">Copy assets</Menu.Item>}
      </Menu>
    )

    return (
      <>
        <div className={styles.container}>
          <div className={styles.searchContainer}>
            <div className={styles.itemIconContainer}>
              <Icon type="search" />
            </div>
            <div
              className={`${styles.row} ${styles.selectContainer}`}
              data-test-selector="select_location"
            >
              <SearchableTree
                labelInValue
                className={styles.searchableTree}
                placeholder="Select"
                searchPlaceholder="Search..."
                treeData={facilitiesInfo}
                onSelect={this.onSelectFacility}
                getPopupContainer={trigger => trigger.parentNode}
                value={selected}
                suffixIcon={<Icon type="caret-down" className="ant-select-arrow-icon" />}
              />
              <ButtonGroup className={styles.buttonGroup}>
                <Button className={styles.goBtn} onClick={this.onGo}>
                  Go
                </Button>
                <Dropdown
                  disabled={!isSelectedFavSpace && levels.length < 3}
                  overlay={goMenu}
                  trigger={['click']}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Button
                    className={styles.secondaryButton}
                    data-test-selector="search_action_dropdown"
                  >
                    <Icon type="ellipsis" />
                  </Button>
                </Dropdown>
              </ButtonGroup>
            </div>
          </div>
          <div className={styles.assetLink}>
            {!isCustomer &&
              renderItemWithInfo(
                'Assets',
                'barcode',
                `[${assets.length}]`,
                this.goToAssetPage,
                'asset_link',
              )}
          </div>
        </div>
        <CopyAssetsDrawer
          visible={isCopying}
          items={copyAssets}
          onClose={this.onCloseCopying}
          onCopy={this.onCopy}
        />
      </>
    )
  }
}

const mapStateToProps = ({ contentAreaNavigation, user }) => ({
  contentAreaNavigation,
  user,
})
export default ContextPanelGQLWrapper(connect(mapStateToProps)(SearchModule))
