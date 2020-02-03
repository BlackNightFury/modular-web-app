import { 
  loadConfig, 
  loadFormConfiguration, 
  loadClickablePrototypeFacilityFabric
} from '../scripts/get-config'

export default function(api) {
  const { Account, Environment, RedirectUrl } = api.config.define
  const config = loadConfig(Account, Environment, 'application.yml')
  if (process.env.NODE_ENV === 'development' && config.adalConfig) {
    config.adalConfig.redirectUri = RedirectUrl
  }

  config.forms = loadFormConfiguration()
  config.facilityConditionSurveyHierarchy = loadClickablePrototypeFacilityFabric()
  config.environment = Environment

  api.addEntryCodeAhead(
    () =>
      // console.log('addEntryCodeAhead');
      // TODO : Now, push this "combined" config into the javascript bundle
      // This is a really bad example about how one could do it
      // would pr
      // return `console.log('testing');`;
      `window.mwa_config = ${JSON.stringify(config)}; console.log(window.mwa_config);`,
  )

  // process.exit();
}
