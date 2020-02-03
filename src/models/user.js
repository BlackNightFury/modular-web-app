import { notification } from 'antd'
import Amplify, { PubSub } from 'aws-amplify'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { logout, getRoles, getCurrentUser, azurelogIn } from '@/services/user'
import { updateAmplifyConf, getAllLegacyProjectIds } from '@/services/utils'
import { getHierarchy } from '@/services/asset'

const {
  aws,
  tenants,
  tenants: { admin },
  adalConfig: { tenant },
  globalUser,
} = window.mwa_config
const legacyProjectIds = getAllLegacyProjectIds(tenants)

const initialValues = {
  id: '',
  name: '',
  roles: [],
  email: '',
  avatar: '',
  authenticated: false,
  isRequiredPassword: false,
  authenticatedBy: 'cognito',
  favSpaces: [],
  facilityPSQCompleted: [],
  status: {
    online: true,
    lastUpdated: moment().toISOString(),
    indicator: 'green',
  },
}

export default {
  namespace: 'user',
  state: initialValues,
  reducers: {
    SET_STATE: (state, { payload }) => {
      const newState = { ...state, ...payload }
      localStorage.setItem('userInfo', JSON.stringify(newState))
      return newState
    },
    RESET_STATE: () => ({ ...initialValues }),
  },
  effects: {
    *LOGIN_SUCCESS({ payload }, saga) {
      const { tenantId, email, isGlobal } = payload
      notification.success({
        message: 'Logged In',
        description: 'You have successfully logged in to ELIAS',
      })

      const roles = getRoles(email)
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          name: `Mr ${roles[0]}`,
          email,
          phone: '',
          roles,
          authenticated: true,
          authenticatedBy: 'cognito',
          tenantId,
          isGlobal,
        }),
      )

      yield saga.put({
        type: 'LOAD_CURRENT_ACCOUNT',
      })
    },
    *LOGIN_SUCCESS_DEMO({ payload }, saga) {
      const { email } = payload

      notification.success({
        message: 'Logged In',
        description: 'You have successfully logged in to ELIAS',
      })

      const roles = getRoles(email)
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          name: `Mr ${roles[0]}`,
          email,
          phone: '',
          roles,
          authenticated: true,
          authenticatedBy: 'demo',
          tenantId: '672FB50-BE2B-405D-9526-CB81427B7B7E',
        }),
      )
      yield saga.put({
        type: 'LOAD_CURRENT_ACCOUNT',
      })
    },
    *LOGIN_SUCCESS_AZURE({ payload }, saga) {
      notification.success({
        message: 'Logged In',
        description: 'You have successfully logged in to ELIAS',
      })

      const { name, email, token } = payload
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          name,
          email,
          phone: '',
          roles: ['admin'],
          authenticated: true,
          authenticatedBy: 'azure',
          tenantId: '672FB50-BE2B-405D-9526-CB81427B7B7E',
          token,
        }),
      )

      yield saga.put({
        type: 'LOAD_CURRENT_ACCOUNT',
      })
    },
    *LOAD_CURRENT_ACCOUNT(_, saga) {
      let userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
        const { authenticatedBy, token, tenantId, isGlobal } = userInfo
        let currentTenant =
          authenticatedBy === 'cognito'
            ? tenants[tenantId]
            : tenants['672FB50-BE2B-405D-9526-CB81427B7B7E']
        currentTenant = isGlobal ? globalUser : currentTenant

        if (!currentTenant) {
          yield saga.put({
            type: 'LOGOUT',
          })
          return
        }
        const userObject = {
          ...cloneDeep(userInfo),
          tenant: currentTenant,
          favSpaces: userInfo.favSpaces || [],
          facilityPSQCompleted: userInfo.facilityPSQCompleted || [],
        }
        if (authenticatedBy === 'azure') {
          Amplify.configure({
            Auth: {
              region: aws.project_region,
              identityPoolId: admin.identityPoolId,
            },
            Storage: {
              AWSS3: {
                bucket: currentTenant.assetImagesS3Bucket, //REQUIRED -  Amazon S3 bucket
                region: aws.project_region, //OPTIONAL -  Amazon service region
              },
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

          try {
            yield saga.call(azurelogIn, token, tenant)
          } catch {
            yield saga.put({
              type: 'LOGOUT',
            })
            return
          }
        } else if (authenticatedBy === 'cognito') {
          updateAmplifyConf(currentTenant, aws.project_region, aws.appsync.graphqlEndpoint)

          try {
            const authenticatedUser = yield saga.call(getCurrentUser)
            if (!authenticatedUser) {
              yield saga.put({
                type: 'SET_STATE',
                payload: initialValues,
              })
              return
            }
            const { email, phone_number: phoneNumber } = authenticatedUser.attributes
            if (email) {
              userObject.email = email
              userObject.phone = phoneNumber
            }
          } catch (e) {
            yield saga.put({
              type: 'LOGOUT',
            })
          }
        }

        yield saga.put({
          type: 'SET_STATE',
          payload: userObject,
        })

        if (authenticatedBy === 'azure') {
          yield saga.put({
            type: 'clickablemenu/GET_ADMIN_DATA',
            payload: {
              email: userObject.email,
            },
          })
        } else {
          yield saga.put({
            type: 'clickablemenu/GET_DATA',
            payload: {
              email: userObject.email,
            },
          })
        }

        getHierarchy(
          isGlobal
            ? legacyProjectIds
            : [{ tenantId, projectId: tenants[tenantId].legacy_project_id }],
        )
      }
    },
    *LOGOUT(_, saga) {
      localStorage.removeItem('tenantId')
      localStorage.removeItem('email')
      localStorage.removeItem('userInfo')
      yield saga.call(logout)

      yield saga.put({
        type: 'RESET_STATE',
      })
    },
  },
  subscriptions: {
    setup: ({ dispatch }) => {
      dispatch({
        type: 'LOAD_CURRENT_ACCOUNT',
      })
    },
  },
}
