import React, { Component } from 'react'
import { Form, Input, Button, Dropdown, notification, Icon, Menu } from 'antd'
import { Helmet } from 'react-helmet'
import { Auth } from 'aws-amplify'
import Link from 'umi/link'
import { connect } from 'dva'

import Office356 from '@/assets/images/office-365.svg'
import PinkLogo from '@/assets/images/Elias_Pink.png'

import styles from './style.scss'
import { updateAmplifyConf } from '@/services/utils'

const ButtonGroup = Button.Group

const { tenants, adalConfig, globalUser, aws } = window.mwa_config

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  state = {
    passwordVisible: false,
  }

  constructor(props) {
    super(props)

    this.azureLogin = React.createRef()
  }

  togglePasswordVisibility = () => {
    const { passwordVisible } = this.state
    this.setState({ passwordVisible: !passwordVisible })
  }

  onSubmit = event => {
    event.preventDefault()
    const viewportmeta = document.querySelector('meta[name="viewport"]')
    const preViewportMetaContent = viewportmeta.getAttribute('content')
    viewportmeta.setAttribute('content', `${preViewportMetaContent}, maximum-scale=1.0`)
    this.passwordInput.focus()
    viewportmeta.setAttribute('content', preViewportMetaContent)
    this.passwordInput.blur()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const { email: rawEmail, password } = values
        const email = rawEmail.toLowerCase()
        if (
          (email === 'surveyor-cp@realestateams.com' ||
            email === 'customer-cp@realestateams.com' ||
            email === 'admin-cp@realestateams.com') &&
          password === 'Realm34$'
        ) {
          dispatch({
            type: 'user/LOGIN_SUCCESS_DEMO',
            payload: { email },
          })
          return
        }

        const id = Object.keys(tenants).find(
          tenantId => tenants[tenantId].dns === email.split('@')[1],
        )
        let isGlobal = false
        let amplifyConfInfo = tenants[id]
        if (!amplifyConfInfo) {
          isGlobal = true
          amplifyConfInfo = globalUser
        }

        updateAmplifyConf(amplifyConfInfo, aws.project_region, aws.appsync.graphqlEndpoint)
        Auth.signIn(email, password)
          .then(response => {
            const { challengeName } = response
            if (challengeName === 'NEW_PASSWORD_REQUIRED') {
              dispatch({
                type: 'user/SET_STATE',
                payload: {
                  isRequiredPassword: true,
                  cognitoUser: response,
                },
              })
              return
            }
            localStorage.removeItem('qaIssues')
            dispatch({
              type: 'user/LOGIN_SUCCESS',
              payload: { email, tenantId: id, isGlobal },
            })
          })
          .catch(err => {
            const { message } = err
            notification.warning({
              message: 'Login Failed',
              description: message,
            })
          })
      }
    })
  }

  onCreateNewPassword = event => {
    event.preventDefault()
    const { form, user, dispatch } = this.props
    form.validateFields((error, values) => {
      if (error) {
        return
      }

      const { newPassword, confirmPassword } = values
      if (newPassword !== confirmPassword) {
        notification.warning({
          message: 'Creating new password failed',
          description: 'Please make sure that you confirmed new password!',
        })
        return
      }

      Auth.completeNewPassword(user.cognitoUser, newPassword)
        .then(() => {
          dispatch({
            type: 'user/SET_STATE',
            payload: {
              isRequiredPassword: false,
            },
          })
        })
        .catch(err => {
          const { message } = err
          notification.warning({
            message: 'Creating new password failed',
            description: message,
          })
        })
    })
  }

  setPasswordItem = item => {
    this.passwordInput = item
  }

  newPasswordItem = item => {
    this.newPasswordInput = item
  }

  confirmPasswordItem = item => {
    this.confirmPasswordItem = item
  }

  signInAzuer = () => {
    this.azureLogin.current.click()
  }

  onMultiFunctionButtonClick = event => {
    event.stopPropagation()
  }

  render() {
    const {
      form,
      user: { fetching, isRequiredPassword },
    } = this.props
    const { passwordVisible } = this.state

    const { redirectUri } = adalConfig

    const multiFunctionMenu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key="office365_login" onClick={this.signInAzuer} className={styles.office365}>
          {/* Office365 */}
          <img className={styles.office365Img} src={Office356} alt="office" />
        </Menu.Item>
      </Menu>
    )
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.block}>
          <div className="row">
            <div className={styles.inner}>
              <div className={styles.form}>
                {isRequiredPassword ? (
                  <>
                    <h4 className="text-uppercase">
                      <strong>Create New Password</strong>
                    </h4>
                    <br />
                    <Form layout="vertical" hideRequiredMark onSubmit={this.onCreateNewPassword}>
                      <Form.Item label="New Password">
                        {form.getFieldDecorator('newPassword', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please input your new password' }],
                        })(<Input size="default" type="password" ref={this.newPasswordItem} />)}
                      </Form.Item>
                      <Form.Item label="Confirm Password">
                        {form.getFieldDecorator('confirmPassword', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please input your new password' }],
                        })(<Input size="default" type="password" ref={this.confirmPasswordItem} />)}
                      </Form.Item>
                      <div className="form-actions">
                        <Button
                          type="primary"
                          className="width-150 mr-4"
                          htmlType="submit"
                          loading={fetching}
                        >
                          Confirm
                        </Button>
                      </div>
                    </Form>
                  </>
                ) : (
                  <>
                    <div className={styles.logoContainer}>
                      <img src={PinkLogo} alt="logo" />
                    </div>
                    <Form
                      className={styles.loginForm}
                      layout="vertical"
                      hideRequiredMark
                      onSubmit={this.onSubmit}
                    >
                      <Form.Item label="Email">
                        {form.getFieldDecorator('email', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please input your e-mail address' }],
                        })(<Input className={styles.emailInput} size="default" />)}
                      </Form.Item>
                      <Form.Item label="Password">
                        {form.getFieldDecorator('password', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please input your password' }],
                        })(
                          <Input
                            className={styles.passwordInput}
                            size="default"
                            type={!passwordVisible ? 'password' : 'text'}
                            ref={this.setPasswordItem}
                          />,
                        )}
                        <Button
                          className={styles.showHideDecorator}
                          onClick={this.togglePasswordVisibility}
                        >
                          {!passwordVisible ? 'show' : 'hide'}
                        </Button>
                      </Form.Item>
                      <Form.Item className={styles.actionGroup}>
                        <Link to="/user/forgot" className={styles.forgotPassword}>
                          Forgot password
                        </Link>
                        <ButtonGroup className={styles.loginButtonGroup}>
                          <Button
                            htmlType="submit"
                            className={styles.loginButton}
                            loading={fetching}
                          >
                            Login
                          </Button>
                          <Dropdown
                            overlay={multiFunctionMenu}
                            trigger={['click']}
                            onClick={this.onMultiFunctionButtonClick}
                            placement="bottomRight"
                          >
                            <Button
                              className={styles.multiFunctionButton}
                              data-test-selector="loginmultifunction_dropdown"
                            >
                              <Icon type="ellipsis" />
                            </Button>
                          </Dropdown>
                        </ButtonGroup>
                      </Form.Item>
                      <a
                        ref={this.azureLogin}
                        style={{ display: 'none' }}
                        href={`https://login.microsoftonline.com/${adalConfig.tenant}/oauth2/v2.0/authorize?client_id=${adalConfig.clientId}&response_type=id_token&redirect_uri=${redirectUri}&scope=openid+User.Read.All+Email+Profile&response_mode=fragment&state=12345&nonce=678910`}
                      >
                        Azure
                      </a>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
