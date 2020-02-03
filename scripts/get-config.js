// config.js
const yaml = require('js-yaml')
const fs = require('fs')
const { merge, reduce } = require('lodash')
const { join } = require('path')

function loadYml(path, options) {
  try {
    const file = fs.readFileSync(path, 'utf8')
    const doc = yaml.safeLoad(file)
    return doc
  } catch (e) {
    if (e.code === 'ENOENT') {
      if (options.debug) console.log('Config file %s not found.', e.path)
    } else {
      throw e
    }
  }
  return {}
}

const loadConfig = (account, stage, configFile, options = {}) => {
  let path = join(__dirname, `../etc/${configFile}`)
  const rootConfig = loadYml(path, options)

  path = join(__dirname, `../etc/${account}/${configFile}`)
  const accountConfig = loadYml(path, options)

  path = join(__dirname, `../etc/${account}/${stage}/${configFile}`)
  const environmentConfig = loadYml(path, options)

  const config = merge(rootConfig, accountConfig, environmentConfig)

  config.tenants = reduce(config.tenants, (memo, tenant, id) => {
    if (tenant.enabled) memo[id] = tenant
    return memo
  }, {})

  return config
}

module.exports.loadFormConfiguration = () => {
  const dirPath = '../etc/static_data/forms'
  const formConfDir = join(__dirname, dirPath)
  try {
    const formConfig = {}
    const files = fs.readdirSync(formConfDir)
    files.forEach(file => {
      try {
        const formId = file.replace('.yml', '')
        formConfig[formId] = loadYml(join(__dirname, `${dirPath}/${file}`), {})
      } catch {
        console.log(`${file} was not found`)
      }
    })
    return formConfig
  } catch {
    return {}
  }
}

module.exports.loadClickablePrototypeFacilityFabric = () => {
  try {
    return loadYml(join(__dirname, `../etc/static_data/condition/clickableprototype_facility_fabric.yml`), {})
  } catch {
    return []
  }
}
module.exports.loadConfig = loadConfig

module.exports.default = () => {}
