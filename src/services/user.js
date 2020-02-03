import firebase from 'firebase/app'
import { Auth } from 'aws-amplify'
import { notification } from 'antd'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAE5G0RI2LwzwTBizhJbnRKIKbiXQIA1dY',
  authDomain: 'cleanui-72a42.firebaseapp.com',
  databaseURL: 'https://cleanui-72a42.firebaseio.com',
  projectId: 'cleanui-72a42',
  storageBucket: 'cleanui-72a42.appspot.com',
  messagingSenderId: '583382839121',
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebase.auth
export default firebaseApp

export async function login(email, password) {
  return firebaseAuth()
    .signInWithEmailAndPassword(email, password)
    .then(() => true)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function logout() {
  return Auth.signOut()
}

export function getRoles(email) {
  if (!email) return ['surveyor']
  if (email.startsWith('surveyor')) return ['surveyor']
  if (email.startsWith('admin')) return ['admin']
  if (email.startsWith('customer')) return ['customer']
  return ['surveyor']
}

export async function getCurrentUser() {
  return Auth.currentAuthenticatedUser()
}

export async function azurelogIn(token, tenant) {
  return Auth.federatedSignIn(`login.microsoftonline.com/${tenant}/v2.0`, { token }, {})
}

export function isAuthenticatedDemoUser(user) {
  return (user || {}).authenticatedBy === 'demo'
}

export function hasRole(roles, role) {
  return roles.indexOf(role) >= 0
}

export const getViewMode = () => localStorage.getItem('viewMode') !== 'card'
export const setViewMode = viewMode => {
  localStorage.setItem('viewMode', viewMode ? 'table' : 'card')
}

export const getDashboardViewMode = () => localStorage.getItem('dashboardViewMode') === 'dashboard'
export const setDashboardViewMode = dashboardViewMode => {
  localStorage.setItem('dashboardViewMode', dashboardViewMode ? 'dashboard' : 'table')
}
