import mockery from 'mockery'

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
})
mockery.registerMock('@/assets/images/avatar.jpeg', 0)
mockery.registerMock('@/assets/images/undefined_avatar.jpeg', 0)
mockery.registerMock('@/assets/images/admin_avatar.jpeg', 0)
