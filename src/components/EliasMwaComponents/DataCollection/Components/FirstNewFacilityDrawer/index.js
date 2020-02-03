import React from 'react'
import { Button, Checkbox } from 'antd'
import { isClickablePrototype } from '@/services/utils'
import FormDrawerContainer from '../FormDrawerContainer'

import styles from './style.scss'

class FirstNewFacilityDrawer extends React.Component {
  state = {
    visible: false,
    checkProjectDoc: false,
    checkFacilityDoc: false,
    checkPreSurvey: false,
  }

  componentDidMount() {
    const visible = localStorage.getItem('firstnewfacility') === null && isClickablePrototype()
    this.setState({ visible })
  }

  onCancel = () => {
    this.setState({ visible: false })
  }

  onContinue = () => {
    localStorage.setItem('firstnewfacility', true)
    this.setState({ visible: false })
  }

  handleChange = (key, e) => {
    this.setState({ [key]: e.target.checked })
  }

  render() {
    const { visible, checkFacilityDoc, checkProjectDoc, checkPreSurvey } = this.state
    return (
      <FormDrawerContainer title="New facility" onClose={this.onCancel} drawerVisible={visible}>
        <p>
          As this is the first time you{"'"}re accessing this facility, please confirm you have read
          the important documentation related to this site:
        </p>
        <br />
        <h6>Project: NHS Wales</h6>
        <div>
          {/*eslint-disable-next-line */}
          <a onClick={() => window.alert('TODO')}>
            <u>Project docs</u>
          </a>
        </div>
        <br />
        <Checkbox checked={checkProjectDoc} onChange={e => this.handleChange('checkProjectDoc', e)}>
          I have read and understood the project documentation
        </Checkbox>
        <br />
        <br />
        <h6>Facility : UHW Heath</h6>
        <div>
          {/*eslint-disable-next-line */}
          <a onClick={() => window.alert('TODO')}>
            <u>Asbestos register</u>
          </a>
        </div>
        <div>
          {/*eslint-disable-next-line */}
          <a onClick={() => window.alert('TODO')}>
            <u>Facility notes</u>
          </a>
        </div>
        <div>
          {/*eslint-disable-next-line */}
          <a onClick={() => window.alert('TODO')}>
            <u>Facility risk assesment</u>
          </a>
        </div>
        <br />
        <Checkbox
          checked={checkFacilityDoc}
          onChange={e => this.handleChange('checkFacilityDoc', e)}
        >
          I have read and understood the facility documentation
        </Checkbox>
        <br />
        <br />
        <p>
          Please also complete the pre suvey quesstionaire (you can access this at any time via the
          contextual help panel, should you need to revise anything later):
        </p>
        <div>
          {/*eslint-disable-next-line */}
          <a onClick={() => window.alert('TODO')}>
            <u>Pre survey questionnaire</u>
          </a>
        </div>
        <br />
        <Checkbox checked={checkPreSurvey} onChange={e => this.handleChange('checkPreSurvey', e)}>
          I have completed the pre survey questionnaire to the best of my ability
        </Checkbox>
        <div className={styles.footer}>
          <Button
            key="back"
            onClick={this.onContinue}
            disabled={!(checkFacilityDoc && checkProjectDoc && checkPreSurvey)}
          >
            Continue
          </Button>
        </div>
      </FormDrawerContainer>
    )
  }
}

export default FirstNewFacilityDrawer
