import React from 'react'
import { Icon } from 'antd'
import localForage from 'localforage'
import _, { cloneDeep, get } from 'lodash'
import Amplify, { Storage, PubSub } from 'aws-amplify'
import { checkIfFacilityCompleted } from './completion'

const urlencode = require('urlencode')

export const makeURL = url => url && url.replace(/\s+/g, '-').toLowerCase()
export const toTitleCase = text =>
  text &&
  text
    .toLowerCase()
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ')
export const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1)
export const isClickablePrototype = () => /\/clickable-prototype(\/|$)/i.test(window.location.href)
export const encodeURL = url => url && urlencode(makeURL(url))
export const urlEncodeObject = object => {
  Object.keys(object).forEach(key => {
    object[key] = encodeURL(object[key])
  })
  return object
}

export const makeSurveyUrl = (project, facility, floor, space) => {
  const baseUrl = `${isClickablePrototype() ? '/clickable-prototype' : ''}/data-collection`
  const {
    project: projectEncoded,
    facility: facilityEncoded,
    floor: floorEncoded,
    space: spaceEncoded,
  } = urlEncodeObject({ project, facility, floor, space })

  if (project === undefined) {
    return makeURL(`${baseUrl}/home`)
  }

  if (facility === undefined) {
    return makeURL(`${baseUrl}/${projectEncoded}`)
  }

  if (floor === undefined) {
    return makeURL(`${baseUrl}/${projectEncoded}/facilities/${facilityEncoded}`)
  }

  if (space === undefined) {
    return makeURL(
      `${baseUrl}/${projectEncoded}/facilities/${facilityEncoded}/floors/${floorEncoded}`,
    )
  }

  return makeURL(
    `${baseUrl}/${projectEncoded}/facilities/${facilityEncoded}/floors/${floorEncoded}/spaces/${spaceEncoded}`,
  )
}

export const makeCustomerUrl = (project, facility, floor, space, asset) => {
  const baseUrl = `${isClickablePrototype() ? '/clickable-prototype' : ''}/my-estate`
  const {
    project: projectEncoded,
    facility: facilityEncoded,
    floor: floorEncoded,
    space: spaceEncoded,
    asset: assetEncoded,
  } = urlEncodeObject({ project, facility, floor, space, asset })

  if (project === undefined) {
    return makeURL(`${baseUrl}/home`)
  }

  if (facility === undefined) {
    return makeURL(`${baseUrl}/${projectEncoded}`)
  }

  if (floor === undefined) {
    return makeURL(`${baseUrl}/${projectEncoded}/facilities/${facilityEncoded}`)
  }

  if (space === undefined) {
    return makeURL(
      `${baseUrl}/${projectEncoded}/facilities/${facilityEncoded}/floors/${floorEncoded}`,
    )
  }

  if (asset === undefined) {
    return makeURL(
      `${baseUrl}/${projectEncoded}/facilities/${facilityEncoded}/floors/${floorEncoded}/spaces/${spaceEncoded}`,
    )
  }

  return makeURL(
    `${baseUrl}/${projectEncoded}/facilities/${facilityEncoded}/floors/${floorEncoded}/spaces/${spaceEncoded}/assets/${assetEncoded}`,
  )
}

export const getAssetTypeFromId = (treeData, id) => {
  let name = null

  treeData.some(typeObj =>
    typeObj.children.some(subTypeObj => {
      const children = subTypeObj.children ? subTypeObj.children : [subTypeObj]
      return children.some(assetTypeObj => {
        if (assetTypeObj.legacyId === id) {
          name = assetTypeObj.type
        }
        return assetTypeObj.legacyId === id
      })
    }),
  )

  return name
}

export const resetAssets = (treeData, assets, isVAInSpace) => {
  const newAssets = []

  treeData.forEach(typeObj => {
    typeObj.children.forEach(subTypeObj => {
      const children = subTypeObj.children ? subTypeObj.children : [subTypeObj]
      children.forEach(assetTypeObj => {
        assets
          .filter(asset => asset.type === assetTypeObj.value)
          .forEach(asset => {
            const newAsset = { ...asset }
            if (isVAInSpace) {
              newAsset.virtual = assetTypeObj.virtual
              newAsset.type = {
                virtual: newAsset.virtual,
                value: newAsset.type,
              }
            }
            const quantityElement =
              assetTypeObj.facets.Description &&
              assetTypeObj.facets.Description.find(element => element.key === 'quantity')
            if (
              quantityElement &&
              (quantityElement.allowMultiple === undefined || !quantityElement.allowMultiple)
            ) {
              newAsset.quantity = 1
            }
            newAssets.push(newAsset)
          })
      })
    })
  })

  return newAssets
}

const KINDS_OF_FILTER = {
  class: 'Class',
  condition: 'Condition',
  criticality: 'Criticality',
  'maintenance-requirement': 'Maintenance Requirement',
  'asset-status': 'Asset Status',
  siteId: 'Site',
  facilityId: 'Facility',
  floorId: 'Floor',
  spaceId: 'Space',
}

export const filterKeysGrouping = filterKeys => {
  const filterKeyGroup = {
    type: [],
    class: [],
    dateRanges: [],
  }
  filterKeys.forEach(item => {
    if (typeof item !== 'string') {
      filterKeyGroup.dateRanges.push(item)
    } else {
      const filterType = item.split('-')[0].trim()
      const field =
        Object.keys(KINDS_OF_FILTER).find(filter => KINDS_OF_FILTER[filter] === filterType) ||
        'type'
      const filterValue =
        field === 'type'
          ? item
          : item
              .split('-')
              .slice(1)
              .join('-')
      if (filterKeyGroup[field]) {
        filterKeyGroup[field].push(filterValue)
      } else {
        filterKeyGroup[field] = [filterValue]
      }
    }
  })

  return filterKeyGroup
}

export const INSTALL_DATE = 'Install Date'
export const EOL = 'EoL'

export const excludeDateFilters = filterKeys =>
  filterKeys.filter(
    key => typeof key === 'string' && !key.startsWith(INSTALL_DATE) && !key.startsWith(EOL),
  )

export const enabledDateFilterKeys = filterKeys => {
  const dateFilterKeys = {}
  filterKeys.forEach(key => {
    if (typeof key === 'string') {
      if (key.startsWith(INSTALL_DATE)) {
        dateFilterKeys[INSTALL_DATE] = true
      }
      if (key.startsWith(EOL)) {
        dateFilterKeys[EOL] = true
      }
    }
  })
  return dateFilterKeys
}

const withinDateRange = (dateString, range) => {
  const date = new Date(dateString)
  const rangeDates = range.map(ds => new Date(ds.split('-').join('/')))
  rangeDates[1].setDate(rangeDates[1].getDate() + 1)
  return date >= rangeDates[0] && date < rangeDates[1]
}

const fitOneCondition = (object, key, filter) => {
  const item =
    ['type', 'class', 'status', 'siteId', 'facilityId', 'floorId', 'spaceId'].indexOf(key) > -1
      ? object[key]
      : object.facets[key]

  if (
    !filter.find(filterItem => {
      if (key === 'class') {
        if (
          (filterItem === 'Core' && object.virtual) ||
          (filterItem === 'Virtual' && !object.virtual)
        ) {
          return false
        }
        return true
      }

      if (key === 'dateRanges') {
        for (let i = 0; i < filter.length; i += 1) {
          if (
            filter[i].type === INSTALL_DATE &&
            !withinDateRange(object.facets['install-date'], filter[i].range)
          ) {
            return false
          }
          if (filter[i].type === EOL) {
            if (!object.spons) {
              return false
            }
            if (!withinDateRange(object.spons.eol, filter[i].range)) {
              return false
            }
          }
        }
        return true
      }

      if (!item) {
        return false
      }
      if (key === 'status' && filterItem === 'EX_DONE') {
        return item !== 'DONE'
      }

      if (_.has(item, 'value')) {
        return filterItem === item.value
      }

      return filterItem === item
    })
  ) {
    return false
  }
  return true
}

export const filterData = (data, filter, allRecords) => {
  if (Array.isArray(data)) {
    if (data.length === 0) return []

    const newFilter = cloneDeep(filter)
    const keys = Object.keys(newFilter)
    for (let i = 0; i < keys.length; i += 1) {
      if (newFilter[keys[i]].length > 0) {
        const index = ['siteId', 'facilityId', 'floorId', 'spaceId'].indexOf(keys[i])
        if (index > -1 && allRecords) {
          const allRecordsKey = ['sites', 'facilities', 'floors', 'spaces'][index]
          const { [allRecordsKey]: items } = allRecords
          newFilter[keys[i]] = newFilter[keys[i]].reduce((prev, filterItem) => {
            const value = items.find(item => item.name === filterItem)
            prev.push(value.id)
            return prev
          }, [])
        }
      }
    }

    return data.filter(object => {
      for (let i = 0; i < keys.length; i += 1) {
        if (newFilter[keys[i]].length > 0) {
          if (!fitOneCondition(object, keys[i], newFilter[keys[i]])) {
            return false
          }
        }
      }
      return true
    })
  }
  return null
}

export const filterAssetTypeTreeData = (treeData, assets) => {
  let filteredAssetTypeTreeData = cloneDeep(treeData)

  if (Array.isArray(filteredAssetTypeTreeData) && assets.length !== 0) {
    const typeIdxs = []
    filteredAssetTypeTreeData.forEach((typeObj, typeIdx) => {
      const newTypeObj = typeObj
      const subTypeIdxs = []
      typeObj.children.forEach((subTypeObj, subTypeIdx) => {
        const newSubTypeObj = subTypeObj
        const assetTypeIdxs = []
        const children = subTypeObj.children ? subTypeObj.children : [subTypeObj]
        children.forEach((assetTypeObj, assetTypeIdx) => {
          if (assets.findIndex(asset => asset.type === assetTypeObj.value) >= 0) {
            assetTypeIdxs.push(assetTypeIdx)
          }
        })
        if (assetTypeIdxs.length) {
          if (newSubTypeObj.children) {
            newSubTypeObj.children = newSubTypeObj.children.filter(
              (assetTypeObj, assetTypeIdx) => assetTypeIdxs.indexOf(assetTypeIdx) !== -1,
            )
          }
          subTypeIdxs.push(subTypeIdx)
        }
      })
      newTypeObj.children = newTypeObj.children.filter(
        (subTypeObj, subTypeIdx) => subTypeIdxs.indexOf(subTypeIdx) !== -1,
      )
      if (subTypeIdxs.length) {
        typeIdxs.push(typeIdx)
      }
    })
    filteredAssetTypeTreeData = filteredAssetTypeTreeData.filter(
      (typeObj, typeIdx) => typeIdxs.indexOf(typeIdx) !== -1,
    )
  }
  return filteredAssetTypeTreeData
}

export const getAdditionalAssetFilter = (assets, allRecords) => {
  const values = {}

  assets.forEach(asset => {
    const { facets } = asset
    Object.keys(KINDS_OF_FILTER).forEach(field => {
      if (facets[field]) {
        if (values[field] && values[field].indexOf(facets[field]) === -1)
          values[field].push(facets[field])
        else if (!values[field]) values[field] = [facets[field]]
      }
    })
  })

  const results = []
  Object.keys(values).forEach(key => {
    const facetsClasses = {
      key: `facet-${key}`,
      selectable: false,
      title: KINDS_OF_FILTER[key],
      value: key,
      children: [],
    }
    values[key].forEach(value => {
      facetsClasses.children.push({
        value: `${KINDS_OF_FILTER[key]}-${value}`,
        key: `${key}.${value}`,
        title: value,
        selectable: true,
      })
    })
    results.push(facetsClasses)
  })

  if (allRecords) {
    const { sites, facilities, floors, spaces } = allRecords
    const idToNameMap = items =>
      items.reduce((prev, val) => {
        prev[val.id] = val.name
        return prev
      }, {})

    const levelNodeGenerator = (root, type, value, title) => {
      const { children } = root
      let node = children.find(obj => obj.id === value)
      if (!node) {
        node = {
          id: value,
          key: `${type}-${value}`,
          selectable: true,
          title,
          value: `${type}-${title}`,
          children: [],
        }

        children.push(node)
      }

      return node
    }

    const siteIdToNameMap = idToNameMap(sites)
    const facilityIdToNameMap = idToNameMap(facilities)
    const floorIdToNameMap = idToNameMap(floors)
    const spaceIdToNameMap = idToNameMap(spaces)

    const location = {
      key: 'asset-location',
      selectable: false,
      title: 'Location',
      value: 'asset-location',
      children: [],
    }

    results.push(location)

    assets.forEach(asset => {
      // Site Level
      const site = levelNodeGenerator(location, 'Site', asset.siteId, siteIdToNameMap[asset.siteId])
      // Facility Level
      const facility = levelNodeGenerator(
        site,
        'Facility',
        asset.facilityId,
        facilityIdToNameMap[asset.facilityId],
      )
      // Floor Level
      const floor = levelNodeGenerator(
        facility,
        'Floor',
        asset.floorId,
        floorIdToNameMap[asset.floorId],
      )
      // Space level
      levelNodeGenerator(floor, 'Space', asset.spaceId, spaceIdToNameMap[asset.spaceId])
    })
  }

  return results
}

export const getAssetClasses = filteredAssetTypeTreeData => {
  let core = false
  let virtual = false
  const assetClasses = {
    key: 'asset-class',
    selectable: false,
    title: 'Asset class',
    value: 'asset-class',
    children: [],
  }

  filteredAssetTypeTreeData.forEach(typeObj => {
    typeObj.children.forEach(subTypeObj => {
      const children = subTypeObj.children ? subTypeObj.children : [subTypeObj]
      children.forEach(assetTypeObj => {
        if (assetTypeObj.virtual) {
          virtual = true
        } else {
          core = true
        }
      })
    })
  })

  if (core) {
    assetClasses.children.push({
      title: 'Core',
      key: 'class-core',
      value: 'Class - Core',
      selectable: true,
    })
  }
  if (virtual) {
    assetClasses.children.push({
      title: 'Virtual',
      key: 'class-virtual',
      value: 'Class - Virtual',
      selectable: true,
    })
  }

  return assetClasses
}

export const getStatisticsAssets = (assets, condition) =>
  assets
    .filter(item => new RegExp(condition).test(item.id))
    .reduce(
      (total, obj) =>
        total + (Number(JSON.parse(obj.data).Quantity) ? Number(JSON.parse(obj.data).Quantity) : 0),
      0,
    )

export const getStatisticsInfo = (assets, condition) =>
  assets.filter(item => item.id.startsWith(condition)).length

const makeTree = (object, bVirAssets, isVAInSpace) => {
  let tree = {
    title: object.type,
    value: object.children
      ? `${object.type}-${object.legacyId}-${object.children.length}`
      : `${object.type}-${object.legacyId}`,
    key: object.children
      ? `${object.type}-${object.legacyId}-${object.children.length}`
      : `${object.type}-${object.legacyId}`,
    selectable: true,
    legacyId: object.legacyId,
    tree: object.tree,
  }

  if (object.children) {
    const children = object.children
      .map(obj => makeTree(obj, bVirAssets, isVAInSpace))
      .filter(obj => obj)
    if (children.length > 0) {
      tree.children = children
      tree.selectable = false
    } else {
      tree = null
    }
  } else {
    tree.facets = object.facets
    tree.lifecycle = object.lifecycle
    tree.virtual = object.virtual
    if (!isVAInSpace) {
      if (object.virtual !== bVirAssets) {
        tree = null
      }
    }
  }

  return tree
}

export const makeHierarchyTree = (hierarchy, bVirAssets = false, isVAInSpace = false) =>
  hierarchy.map(obj => makeTree(obj, bVirAssets, isVAInSpace)).filter(obj => obj)

const makeSubType2SysTypeMap = (object, sysType, result) => {
  if (object.children) {
    object.children.forEach(element => {
      makeSubType2SysTypeMap(element, sysType, result)
    })
  } else {
    const copyResult = result
    copyResult[object.type] = sysType
  }
}

export const makeHierarchySubType2SysTypeMap = hierarchy => {
  const result = {}
  hierarchy.forEach(element => {
    makeSubType2SysTypeMap(element, element.type, result)
  })

  return result
}

export const findDetailsFromHierarchyTree = (key, object) => {
  if (Array.isArray(object)) {
    for (let index = 0; index < object.length; index += 1) {
      const facet = findDetailsFromHierarchyTree(key, object[index])
      if (facet !== null) {
        return facet
      }
    }
  } else {
    if (object.value === key) {
      return {
        description: object.title,
        legacyId: object.legacyId,
        facets: object.facets,
        lifecycle: object.lifecycle,
        virtual: object.virtual,
        tree: object.tree,
      }
    }
    if (object.children) return findDetailsFromHierarchyTree(key, object.children)
  }

  return null
}

export const getLevelsFromHierarchyTree = (key, object) => {
  const detail = findDetailsFromHierarchyTree(key, object)
  return {
    description: detail.description,
    legacyId: detail.legacyId,
    virtual: detail.virtual,
    tree: detail.tree,
  }
}

export const clearCache = async () => {
  localStorage.clear()
  if (window.caches) {
    const keys = await window.caches.keys()
    for (let i = 0; i < keys; i += 1) {
      window.caches.delete(keys[i])
    }
  }
  await localForage.clear()
}

/*
 Remove empty string in object to prevent appsync mutation error
*/

export const removeEmptyValues = object =>
  _.reduce(
    object,
    (newObject, value, key) => {
      if (value !== '') {
        return {
          ...newObject,
          [key]: value === undefined ? null : value,
        }
      }
      return newObject
    },
    {},
  )

export const flattenToArray = object => {
  const keys = Object.keys(object)
  const facets = _.reduce(keys, (result, key) => result.concat(object[key]), [])

  return facets
}

export const flattenToObject = object => {
  const keys = Object.keys(object)
  const facets = _.reduce(keys, (result, key) => ({ ...result, ...object[key] }), {})

  return facets
}

export const getSorter = sortOption => {
  const { field, sortFunction } = sortOption

  return ['type'].includes(field) ? sortFunction : field
}

export const sort = (array, sortBy, ascending) => {
  const changeNullToDefault = (obj, path, defaultValue) =>
    get(obj, path, defaultValue) !== null ? get(obj, path, defaultValue) : defaultValue

  return [...array].sort((a, b) => {
    if (typeof sortBy === 'function') {
      return ascending ? sortBy(a, b) : sortBy(b, a)
    }
    if (
      typeof changeNullToDefault(a, sortBy, 0) === 'number' &&
      typeof changeNullToDefault(b, sortBy, 0) === 'number'
    ) {
      return ascending
        ? changeNullToDefault(a, sortBy, 0) - changeNullToDefault(b, sortBy, 0)
        : changeNullToDefault(b, sortBy, 0) - changeNullToDefault(a, sortBy, 0)
    }
    return ascending
      ? changeNullToDefault(a, sortBy, '').localeCompare(changeNullToDefault(b, sortBy, ''))
      : changeNullToDefault(b, sortBy, '').localeCompare(changeNullToDefault(a, sortBy, ''))
  })
}

export const checkIfFacilityPSQCompleted = (formId, facilityId, facilityCompletedIds) => {
  const { forms } = window.mwa_config
  if (isClickablePrototype()) {
    return false
  }

  if (formId) {
    const form = forms[formId]
    if (form) {
      const isPSQCompleted =
        _.findIndex(facilityCompletedIds, facilityPSQ => facilityPSQ.facilityId === facilityId) > -1
      if (isPSQCompleted) {
        return true
      }
    }
  }

  return false
}

export const checkIfReadOnly = (readOnlyFromProject, isPSQCompleted, isFacilityCompleted) => {
  const readOnly =
    !isClickablePrototype() && (readOnlyFromProject || !isPSQCompleted || isFacilityCompleted)

  let readOnlyReason
  if (readOnly) {
    if (readOnlyFromProject) {
      readOnlyReason = 'ProjectReadOnly'
    } else if (isFacilityCompleted) {
      readOnlyReason = 'FacilityCompleted'
    } else {
      readOnlyReason = 'PSQNotCompleted'
    }
  }
  return {
    readOnly,
    readOnlyReason,
  }
}

export const checkIfReadOnlyFromParent = (
  project,
  facility,
  formResponses,
  facilities,
  facilityPSQCompleted,
) => {
  const projectReadOnly = project && project.readonly
  const facilityCompleted = checkIfFacilityCompleted(
    formResponses,
    facilities,
    makeURL(facility && facility.name),
  )
  const psqCompleted =
    project &&
    facility &&
    checkIfFacilityPSQCompleted(project.preSurveyQuestionnaire, facility.id, facilityPSQCompleted)
  return checkIfReadOnly(projectReadOnly, psqCompleted, facilityCompleted)
}

export const getProjectByName = (projects, projectNameEncoded) => {
  const filteredProjects = projects.filter(project => makeURL(project.name) === projectNameEncoded)
  return filteredProjects.length > 0 ? filteredProjects[0] : {}
}

export const getProjectFromEncoded = (projects, projectEncoded) => {
  const filteredProjects = projects.filter(
    project => makeURL(`${project.code}-${project.name}`) === projectEncoded,
  )
  return filteredProjects.length > 0 ? filteredProjects[0] : {}
}

export const mappingStatusText = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  EX_DONE: 'Excluding done',
  INACCESSIBLE: 'Inaccessible',
}

export const mappingStatusVisualIndicator = {
  NOT_STARTED: (
    <i className="anticon" data-test-selector="NOT_STARTED">
      <svg viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" />
      </svg>
    </i>
  ),
  IN_PROGRESS: <Icon type="clock-circle" data-test-selector="IN_PROGRESS" />,
  DONE: (
    <Icon type="check-circle" style={{ backgroundColor: '#baf9ba' }} data-test-selector="DONE" />
  ),
  INACCESSIBLE: (
    <Icon
      type="exclamation-circle"
      style={{ backgroundColor: '#F69898' }}
      data-test-selector="INACCESSIBLE"
    />
  ),
}

export const updateAmplifyConf = (tenant, region, graphqlEndpoint) => {
  const { userPoolId, userPoolWebClientId, identityPoolId, assetImagesS3Bucket } = tenant
  Amplify.configure({
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId,
      identityPoolId,
    },
    Storage: {
      AWSS3: {
        bucket: assetImagesS3Bucket,
        region,
      },
    },
    aws_appsync_graphqlEndpoint: graphqlEndpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: 'AWS_IAM',
  })

  PubSub.configure({
    aws_appsync_graphqlEndpoint: graphqlEndpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: 'AWS_IAM',
  })
}

export const updateStorage = (tenant, region) => {
  if (!tenant) {
    return
  }
  const { assetImagesS3Bucket, identityPoolId } = tenant
  Storage.configure({
    bucket: assetImagesS3Bucket,
    region,
    level: 'public',
    identityPoolId,
  })
}

export const getAllLegacyProjectIds = tenants =>
  Object.keys(tenants).reduce((result, tenantId) => {
    const tenant = tenants[tenantId]
    if (!tenant) {
      return result
    }
    if (tenant.legacy_project_id && !result.find(id => id === tenant.legacy_project_id)) {
      result.push({ tenantId, projectId: tenant.legacy_project_id })
    }

    return result
  }, [])

export const getEncodedNameFromUrlEncoded = encoded => {
  const part = urlencode.decode(encoded).split('-')
  return part.filter((partStr, index) => index !== 0).join('-')
}

export const getEncodedIdOrCodeFromUrlEncoded = encoded => encoded.split('-')[0]

export const getConcatenatedUrl = (idOrCode, name) => `${idOrCode}-${name}`

export const random6DigitsGenerator = () => `${Math.floor(100000 + Math.random() * 900000)}`

export const makeSentenceCase = text => {
  if (!text || typeof text !== 'string') {
    return text
  }
  const lowerCased = text.toLowerCase()
  return lowerCased.replace(/[a-z]/i, letter => letter.toUpperCase()).trim()
}

export const loadGoogleMapScript = (apiKey, callback) => {
  const existingScript = document.getElementById('google-maps')
  if (!existingScript) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}` // URL for the third-party library being loaded.
    script.id = 'google-maps' // e.g., googleMaps or stripe
    document.body.appendChild(script)

    script.onload = () => {
      if (callback) callback()
    }
  }

  if (existingScript && callback) callback()
}
