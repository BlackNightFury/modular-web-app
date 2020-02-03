const localStorageMock = (() => {
  let store = {}

  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: key => {
      store[key] = null
    },
    clear: () => {
      store = {}
    },
  }
})()

global.localStorage = localStorageMock
