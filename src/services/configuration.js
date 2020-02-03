const _ = require('lodash')

const checkCamera = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    return navigator.mediaDevices.enumerateDevices().then(devices => {
      let cam = false
      devices.forEach(device => {
        if (device.kind === 'videoinput') {
          cam = true
        }
      })
      return cam
    })
  }
  return Promise.resolve(false)
}

module.exports = () =>
  checkCamera().then(hasCamera => {
    const {
      mwa_config: { MOCK_OS, MOCK_NON_CAMERA },
    } = window
    return _.extend(window.mwa_config, {
      capabilities: {
        isWindows: navigator.appVersion.indexOf('Win') !== -1 || MOCK_OS === 'windows',
        hasCamera: hasCamera && !MOCK_NON_CAMERA,
        facingMode: process.env.NODE_ENV === 'development' ? 'user' : { exact: 'environment' },
      },
    })
  })
