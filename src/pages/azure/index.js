import React from 'react'
import PropTypes from 'prop-types'
import { notification, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import qs from 'qs'
import Amplify, { Auth, PubSub } from 'aws-amplify'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import jwtDecode from 'jwt-decode'

import styles from './style.scss'

const {
  aws,
  tenants: {
    admin: { identityPoolId },
  },
  adalConfig: { tenant },
} = window.mwa_config

@withRouter
@connect(({ user }) => ({ user }))
class AzureLogInRedirect extends React.Component {
  componentDidMount() {
    const {
      history,
      history: {
        location: { hash },
      },
      dispatch,
    } = this.props

    const query = qs.parse(hash)
    Amplify.configure({
      Auth: {
        region: aws.project_region,
        identityPoolId,
      },
      aws_appsync_graphqlEndpoint: aws.appsync.graphqlEndpoint,
      aws_appsync_region: aws.project_region,
      aws_appsync_authenticationType: 'AWS_IAM',
    })
    PubSub.configure({
      aws_appsync_graphqlEndpoint: aws.appsync.graphqlEndpoint,
      aws_appsync_region: aws.project_region,
      aws_appsync_authenticationType: 'AWS_IAM',
    })

    const token = query['#id_token']

    Auth.federatedSignIn(`login.microsoftonline.com/${tenant}/v2.0`, { token }, {})
      .then(() => {
        localStorage.removeItem('qaIssues')
        const decoded = jwtDecode(token)
        dispatch({
          type: 'user/LOGIN_SUCCESS_AZURE',
          payload: {
            token,
            email: decoded.email,
            name: decoded.name,
          },
        })
      })
      .catch(() => {
        history.push('/user/login')
        notification.warning({
          message: 'Login Failed',
        })
      })
  }

  render() {
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.title}>
          <h1>
            <strong>Welcome to the ELIAS next gen MVP</strong>
          </h1>
          <p>
            Please remember this is a very early demonstration, and is in a constant state of flux.
            We are not looking for bug reports, just giving a view into the functionality that we’re
            working on.
            <br />
            For access please contact it@realestateams.com
          </p>
        </div>
        <div className={styles.block}>
          <div className="row">
            <div className={styles.inner}>
              <Spin size="large" />
              <div className={styles.loadingText}>
                <strong>Logging in with office 365... </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AzureLogInRedirect.propTypes = {
  history: PropTypes.shape({}).isRequired,
}

export default AzureLogInRedirect
