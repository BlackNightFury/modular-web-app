export const sendMessage = message =>
  new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel()
    messageChannel.port1.onmessage = event => {
      if (event.data.error) {
        reject(event.data.error)
      } else {
        resolve(event.data)
      }
    }
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    }
  })

export const cacheDocs = data => {
  let requiredDocs = []
  if (data.listProjects) {
    const {
      listProjects: { items: projects },
    } = data
    projects.forEach(item => {
      if (item.docs) {
        requiredDocs = requiredDocs.concat(item.docs)
      }
    })
  }
  if (data.listFacilities) {
    const {
      listFacilities: { items: facilities },
    } = data
    facilities.forEach(item => {
      if (item.docs) {
        requiredDocs = requiredDocs.concat(item.docs)
      }
    })
  }

  const preloadDocLinks = requiredDocs.map(doc => `/docs/${doc.id}.pdf`)

  if ('serviceWorker' in navigator && !navigator.serviceWorker.disabled) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        sendMessage({
          command: 'preload',
          preloadDocLinks,
        })
      })
      .catch(() => {
        navigator.serviceWorker.disabled = true
      })
  }
}
