import ReactGA from 'react-ga'

function GASetup() {
  const { googleAnalytics } = window.mwa_config
  if (googleAnalytics && googleAnalytics.trackingID) {
    const { trackingID } = googleAnalytics
    ReactGA.initialize(trackingID)

    const history = window.g_history
    const { location } = history
    ReactGA.pageview(location.pathname)

    history.listen(newLocation => {
      ReactGA.pageview(newLocation.pathname)
    })
  }
}

GASetup()

export default GASetup
