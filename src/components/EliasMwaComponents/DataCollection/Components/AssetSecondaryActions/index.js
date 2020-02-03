import React from 'react'
import { Button, Dropdown, Icon } from 'antd'

const ButtonGroup = Button.Group

const AssetSecondaryActions = ({
  onClick,
  dataTestSelectorAction,
  dropdownOverlay,
  dropdownClick,
  dataTestSelectorEllipsis,
  placement,
  isCustomer,
}) => (
  <ButtonGroup>
    <Button data-test-selector={dataTestSelectorAction} onClick={onClick}>
      {isCustomer ? 'View' : 'Edit'}
    </Button>
    <Dropdown
      overlay={dropdownOverlay}
      trigger={['click']}
      onClick={dropdownClick}
      placement={placement}
    >
      <Button data-test-selector={dataTestSelectorEllipsis}>
        <Icon type="ellipsis" />
      </Button>
    </Dropdown>
  </ButtonGroup>
)

export default AssetSecondaryActions
