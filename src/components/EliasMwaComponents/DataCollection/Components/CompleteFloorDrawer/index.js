import React from 'react'
import { Collapse, Icon, Button, Checkbox } from 'antd'
import FormDrawerContainer from '../FormDrawerContainer'
import { getAssetTypeFromId, mappingStatusText } from '@/services/utils'
import { RAG } from '@/services/asset'

import styles from './style.scss'

const { Panel } = Collapse

const RAGText = (rag, message) => (
  <div className={styles.ragWrapper}>
    <div className={styles.rag} style={{ backgroundColor: RAG[rag] }} />
    {message}
  </div>
)

const Space = ({ item, onPress }) => (
  <div
    onKeyPress={onPress}
    onClick={onPress}
    role="button"
    tabIndex="0"
    data-test-selector="space-in-complete-floor"
  >
    <h6>
      {RAGText(
        item.status === 'IN_PROGRESS' ? 'A' : 'R',
        `${item.name}. ${mappingStatusText[item.status]}`,
      )}
    </h6>
    {item.notes && item.notes.reminder}
  </div>
)

class CompleteFloorDrawer extends React.Component {
  state = {
    accepted: false,
  }

  componentDidUpdate(prevProps) {
    const { visible, item } = this.props

    if (prevProps.visible !== visible && prevProps.item !== item) {
      this.setState({ accepted: false }) //eslint-disable-line
    }
  }

  onChangeAccepted = e => {
    this.setState({ accepted: e.target.checked })
  }

  render() {
    const {
      visible,
      item,
      mandatoryTypes,
      treeData,
      onClose,
      onSelectSpace,
      onCompleteFloor,
    } = this.props
    const { accepted } = this.state
    console.log(mandatoryTypes)
    if (!item) return null
    const spaces = item.subSpaces
    const notDoneSpaces = spaces.filter(
      obj =>
        (obj.status === 'INACCESSIBLE' && new Date(obj.availableDate) < Date.now()) ||
        obj.status === 'NOT_STARTED' ||
        obj.status === 'IN_PROGRESS',
    )

    const inaccessibleSpaces = spaces.filter(
      obj => obj.status === 'INACCESSIBLE' && new Date(obj.availableDate) >= Date.now(),
    )

    const missingMandatoryTypes = mandatoryTypes.filter(id => {
      const subAssets = (item && item.subAssets) || []
      const length = String(id).length + 1

      return subAssets.filter(asset => asset.type.slice(-length) === `-${id}`).length === 0
    })

    const renderPanel = (itemList, headerPrefix, totalList, key, panelItemElm) => (
      <Panel
        header={RAGText(
          itemList.length > 0 ? 'R' : 'G',
          `${headerPrefix} (${itemList.length} of ${totalList.length})`,
        )}
        key={key}
        data-test-selector={key}
        showArrow={itemList.length > 0}
        className={`${itemList.length === 0 ? styles.disableClick : ''}`}
      >
        {itemList.map(obj =>
          !panelItemElm ? (
            <Space key={obj.id} item={obj} onPress={() => onSelectSpace(obj)} />
          ) : (
            panelItemElm(obj)
          ),
        )}
      </Panel>
    )

    const missingMandatoryItem = type => (
      <h6 key={type}>{RAGText('R', `${getAssetTypeFromId(treeData, type)}-${type}`)}</h6>
    )

    return (
      <FormDrawerContainer
        onClose={onClose}
        drawerVisible={visible}
        testSelector="complete-floor-drawer"
      >
        <div className="drawerHeader">Floor completion - {item && item.name}</div>
        <div className={styles.information}>
          <Icon type="exclamation-circle" className={styles.exclamation} />
          <div className={styles.description}>
            By marking a floor as complete you agree that you have checked the floor its spaces and
            assets are in an appropriate level of completion and accuracy. Your details will be
            recorded against the completion.
          </div>
        </div>
        <Collapse className={styles.completeFloorCollapse}>
          {renderPanel(notDoneSpaces, 'Spaces not done', spaces, 'NotDoneSpaces')}
          {renderPanel(inaccessibleSpaces, 'Inaccessible spaces', spaces, 'InaccessibleSpaces')}
          {renderPanel(
            missingMandatoryTypes,
            'Compulsory assets',
            mandatoryTypes,
            'CompulsoryAssets',
            missingMandatoryItem,
          )}
        </Collapse>
        <br />
        <Checkbox
          checked={accepted}
          onChange={this.onChangeAccepted}
          data-test-selector="complete-floor-checkbox"
        >
          I have checked all rooms and assets are correct and want to mark this floor as complete
        </Checkbox>
        <p />
        <div className={styles.actionContainer}>
          <Button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </Button>
          <Button
            data-test-selector="complete-floor-submit"
            className={styles.submitBtn}
            disabled={!accepted}
            onClick={() => onCompleteFloor({ ...item, status: 'DONE' })}
          >
            Mark floor complete
          </Button>
        </div>
      </FormDrawerContainer>
    )
  }
}

export default CompleteFloorDrawer
