import React from 'react'
import { Row, Col } from 'antd'
import ActionCard from '../ActionCard'
import VirtualAssetsCardDetail from './VirtualAssetCardDetail'
import AssetsCardDetail from './AssetCardDetail'
import InfiniteScrollWithMore from '../InfiniteScrollWithMore'
import { findDetailsFromHierarchyTree } from '@/services/utils'
import { getBrowserLocaledDateTimeString } from '@/services/datetime'

class AssetsCardList extends InfiniteScrollWithMore {
  static defaultProps = {
    data: [],
    subType2SysType: {},
    isVirtualAssets: false,
  }

  onAdd = (itemData, newQty) => {
    const { onUpdate, treeData } = this.props
    const newType = itemData.type.value || itemData.type
    const detailHierachy = findDetailsFromHierarchyTree(newType, treeData)

    if (itemData.facets && itemData.facets.condition) {
      const field = (detailHierachy.facets || []).find(
        obj => obj.key === 'condition' && obj.element === 'facets',
      )
      if (field && field.options) {
        const obj = field.options.find(obj1 => obj1.code === itemData.facets.condition)
        itemData.facets.condition = obj || itemData.facets.condition
      }
    }
    const newItemData = {
      ...itemData,
      facets: {
        ...itemData.facets,
        quantity: newQty,
        'install-date': getBrowserLocaledDateTimeString(itemData.facets['install-date']),
      },
    }

    onUpdate(newItemData, true)
  }

  render() {
    const {
      onDelete,
      onEdit,
      onMenu,
      tenant,
      isVirtualAssets,
      isVAInSpace,
      readOnly,
      isCopyAssets,
    } = this.props
    const { visibleData } = this.state
    const menuItems = ['Edit']
    if (!readOnly) {
      menuItems.push('Delete')
    }

    return (
      <>
        <Row gutter={16} type="flex">
          {visibleData.map((itemData, idx) => (
            <Col
              data-test-selector="assetcardlist_column"
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              key={itemData.id}
            >
              <ActionCard
                data-test-selector="assetcardlist_card"
                menus={menuItems}
                onSecondaryAction={() => !readOnly && onDelete(itemData)}
                onSelectMenu={({ key }) => onMenu(key, itemData)}
              >
                {(isVAInSpace && !itemData.type.virtual) || (!isVAInSpace && !isVirtualAssets) ? (
                  <AssetsCardDetail
                    itemData={itemData}
                    tenant={tenant}
                    onEdit={() => onEdit(itemData)}
                    onDelete={() => onDelete(itemData)}
                    isVAInSpace={isVAInSpace}
                    isOdd={idx % 2}
                    isCopyAssets={isCopyAssets}
                  />
                ) : (
                  <VirtualAssetsCardDetail
                    itemData={itemData}
                    tenant={tenant}
                    onAdd={delta => this.onAdd(itemData, delta)}
                    onEdit={() => onEdit(itemData)}
                    onDelete={() => onDelete(itemData)}
                    isVAInSpace={isVAInSpace}
                    readOnly={readOnly}
                    isOdd={idx % 2}
                    isCopyAssets={isCopyAssets}
                  />
                )}
              </ActionCard>
            </Col>
          ))}
        </Row>
        {super.render()}
      </>
    )
  }
}

export default AssetsCardList
