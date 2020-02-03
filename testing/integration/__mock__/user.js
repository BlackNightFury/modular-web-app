export function getRoles(email) {
  if (!email) return ['surveyor']
  if (email.startsWith('surveyor')) return ['surveyor']
  if (email.startsWith('admin')) return ['admin']
  if (email.startsWith('customer')) return ['customer']
  return ['surveyor']
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

export const getDashboardViewMode = () => false
export const setDashboardViewMode = dashboardViewMode => {
  localStorage.setItem('dashboardViewMode', dashboardViewMode ? 'dashboard' : 'table')
}
