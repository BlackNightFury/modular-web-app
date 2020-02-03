import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
import Link from 'umi/link'
import { connect } from 'dva'
import styles from './style.scss'

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { fetching },
    } = this.props
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.title}>
          <h1>
            <strong>WELCOME TO CLEAN UI ADMIN TEMPLATE</strong>
          </h1>
          <p>
            Pluggable enterprise-level react application framework.
            <br />
            An excellent front-end solution for web applications built upon Ant Design and UmiJS.
            <br />
            Credentials for testing purposes - <strong>surveyor@realestateams.com</strong> /{' '}
            <strong>cleanui</strong>
          </p>
        </div>
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Please log in</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: 'surveyor@realestateams.com',
                        rules: [{ required: true, message: 'Please input your e-mail address' }],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: 'cleanui',
                        rules: [{ required: true, message: 'Please input your password' }],
                      })(<Input size="default" type="password" />)}
                    </Form.Item>
                    <div className="mb-2">
                      <Link to="/user/forgot" className="utils__link--blue utils__link--underlined">
                        Forgot password
                      </Link>
                    </div>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={fetching}
                      >
                        Login
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
