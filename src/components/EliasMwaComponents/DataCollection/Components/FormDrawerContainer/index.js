import React from 'react'
import { Drawer, Row, Col } from 'antd'
import classNames from 'classnames'
import FormDrawerHeader from '../FormDrawerHeader'
import styles from './style.scss'

const FormDrawerContainer = ({ title, drawerVisible, onClose, children, testSelector }) => (
  <Drawer
    className="form-drawer-container"
    placement="right"
    closable={false}
    onClose={onClose}
    visible={drawerVisible}
    width="100%"
    style={{
      background: 'transparent',
      height: '100%',
    }}
  >
    <Row className="form-drawer-grid-container" data-test-selector={testSelector}>
      <Col md={6} lg={16} xl={17} className={styles.blankCol} />
      <Col md={18} lg={8} xl={7} className={classNames('form-drawer-content', styles.drawerCol)}>
        {title && <FormDrawerHeader text={title} />}
        <div className="form-drawer-content-body">{children}</div>
      </Col>
    </Row>
  </Drawer>
)

export default FormDrawerContainer
