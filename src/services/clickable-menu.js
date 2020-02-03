import { hasRole } from '@/services/user'

const menus = {
  surveyor: [
    {
      title: 'Home',
      key: 'home',
      url: '/data-collection/home',
      icon: 'icmn icmn-home',
    },
    {
      title: 'Messages',
      key: 'messages',
      icon: 'icmn icmn-envelop',
      url: '/data-collection/messaging',
    },
  ],
  admin: [
    {
      title: 'Home',
      key: 'home',
      url: '/admin/home',
      icon: 'icmn icmn-home',
    },
  ],
  customer: [
    {
      title: 'Home',
      key: 'home',
      url: '/home',
      icon: 'icmn icmn-home',
    },
    {
      title: 'My Estate',
      key: 'my-estate',
      url: '/my-estate',
      icon: 'icmn icmn-office',
    },
  ],
}
export async function getLeftMenuData(roles = []) {
  if (hasRole(roles, 'admin')) {
    return menus.admin
  }
  if (hasRole(roles, 'surveyor')) {
    return menus.surveyor
  }

  return menus.customer
}

export async function getTopMenuData(roles = []) {
  if (hasRole(roles, 'admin')) {
    return menus.admin
  }
  if (hasRole(roles, 'surveyor')) {
    return menus.surveyor
  }

  return menus.customer
}
