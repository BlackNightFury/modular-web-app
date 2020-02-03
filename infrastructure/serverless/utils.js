const padWithZeros = (number, length) => {
  let myString = `${number}`
  while (myString.length < length) {
    myString = `0${myString}`
  }

  return myString
}

const flattenKeys = (obj, key, retVal) => {
  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    keys.forEach(indexKey => {
      const newKey = key ? `${key}.${indexKey}` : indexKey
      if (typeof obj[indexKey] === 'object') {
        flattenKeys(obj[indexKey], newKey, retVal)
      } else {
        retVal[newKey] = obj[indexKey]
      }
    })
  }
}

const getQueryOptions = filterIds => {
  let moreOptions = []
  if (filterIds) {
    const flattenFilters = {}
    flattenKeys(filterIds, null, flattenFilters)
    moreOptions = Object.keys(flattenFilters).reduce((prev, key) => {
      let newRes = prev
      newRes = newRes.concat({ match: { [key]: flattenFilters[key] } })
      return newRes
    }, [])
  }

  return moreOptions
}

const getQueryFilterOptions = filters => {
  let moreOptions = []
  if (filters) {
    moreOptions = Object.keys(filters).reduce((prev, key) => {
      let newRes = prev
      newRes = newRes.concat({ term: { [`${key}.keyword`]: filters[key] } })
      return newRes
    }, [])
  }

  return moreOptions
}

module.exports = {
  padWithZeros,
  getQueryOptions,
  getQueryFilterOptions,
}
