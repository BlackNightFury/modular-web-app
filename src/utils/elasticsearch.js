import _ from 'lodash'
import { Client } from 'elasticsearch'
//We need it because we cannot get aws-sdk as dependency
//If we have it in dependency, it is conflicting with amplify aws-sdk dependency
//It will be installed by amplify in the background.

//eslint-disable-next-line
import AWS from 'aws-sdk'
import Amplify from 'aws-amplify'
import { formatNumber } from '@/utils/charts'
import colors from '@/assets/colors'

const mwaConfig = require('@/services/configuration')

const esType = 'docs'
const NUMBER_OF_BUBBLES_IN_CHART = 6

export const configureES = async tenantId => {
  const { elasticSearchEndpoint, aws, tenants } = (await mwaConfig()) || {}
  const tenantInfo = (tenants || {})[tenantId]
  const { identityPoolId, userPoolId } = tenantInfo
  const session = await Amplify.Auth.currentSession()
  const region = (aws || {}).project_region
  AWS.config.update({
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: {
        [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: session.getIdToken().getJwtToken(),
      },
    }),
    region,
  })
  return Client({
    host: elasticSearchEndpoint,
    connectionClass: require('http-aws-es'),
    level: 'trace',
  })
}

export const getAllAssets = async tenantId => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}
  const results = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      from: 0,
      size: 10000,
      query: {
        bool: {
          must: [
            {
              match: {
                dataType: 'asset',
              },
            },
            {
              match: {
                version: 'v0000',
              },
            },
          ],
        },
      },
    },
  })

  return results.hits.hits.map(item => item._source)
}

export const getFacilityIds = async tenantId => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}
  const results = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      from: 0,
      size: 10000,
      query: {
        bool: {
          must: [
            {
              match: {
                dataType: 'facility',
              },
            },
            {
              match: {
                version: 'v0000',
              },
            },
          ],
        },
      },
      aggs: {
        values: {
          composite: {
            sources: [
              {
                facility_id: {
                  terms: {
                    field: 'id.keyword',
                  },
                },
              },
            ],
          },
        },
      },
    },
  })

  return results.aggregations.values.buckets.map(bucket => bucket.key.facility_id)
}

export const getNumberOfRecordsInFacilityByType = async (tenantId, facilityId) => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}
  try {
    const results = await esClient.search({
      index: `${environment}-${tenantId.toLowerCase()}`,
      type: esType,
      body: {
        from: 0,
        size: 10000,
        query: {
          bool: {
            must: [
              {
                match: {
                  'facility.id.keyword': facilityId,
                },
              },
              {
                match: {
                  version: 'v0000',
                },
              },
            ],
          },
        },
        aggs: {
          values: {
            composite: {
              sources: [
                {
                  dataType: {
                    terms: {
                      field: 'dataType.keyword',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    })

    return {
      facilityId,
      ..._.reduce(
        results.aggregations.values.buckets,
        (result, bucket) => {
          result[bucket.key.dataType] = bucket.doc_count
          return result
        },
        {},
      ),
    }
  } catch {
    return {
      facilityId,
    }
  }
}

export const simplifyConditionByFacilityAssetsAggregation = results => {
  const conditions = []
  const conditionCountsArr = results.aggregations.facilities.buckets.map(facilityBucket => ({
    facilityName: facilityBucket.facilityName.buckets[0].key,
    byConditionCount: facilityBucket.conditions.buckets.reduce((prev, cur) => {
      prev[cur.key] = cur.doc_count
      if (conditions.indexOf(cur.key) === -1) conditions.push(cur.key)
      return prev
    }, {}),
  }))

  return {
    conditions,
    assetsByConditionAndFacility: conditions.map(condition =>
      conditionCountsArr.map(item => item.byConditionCount[condition] || 0),
    ),
    facilityNames: conditionCountsArr.map(item => item.facilityName),
  }
}

export const filterKeysToESQuery = filter => {
  let should = []
  let must = []
  Object.keys(filter).forEach(filterKey => {
    const filterItem = filter[filterKey]
    if (filterKey === 'assetType') {
      if (filterItem.class !== 'ALL') {
        must.push({ match: { 'assetType.virtual': filterItem.class === 'VIRTUAL' } })
      }
      const assetShould = filterItem.trees
        ? filterItem.trees.map(type => ({
            bool: {
              must: type.map(obj => ({ term: { 'assetType.tree.keyword': obj } })),
            },
          }))
        : []
      should = should.concat(assetShould)
    } else if (['siteId', 'facilityId', 'floorId', 'spaceId'].includes(filterKey)) {
      const filterShould = filterItem.map(filterObj => ({
        match: {
          [`${filterKey.slice(0, -2)}.name.keyword`]: filterObj,
        },
      }))
      must = must.concat({
        bool: {
          should: filterShould,
          minimum_should_match: 1,
        },
      })
    } else if (
      ['condition', 'criticality', 'maintenance-requirement', 'asset-status'].includes(filterKey)
    ) {
      const filterShould = filterItem.map(filterObj => ({
        match: {
          [filterKey === 'condition'
            ? `facets.${filterKey}.code`
            : `facets.${filterKey}`]: filterObj,
        },
      }))
      must = must.concat({
        bool: {
          should: filterShould,
          minimum_should_match: 1,
        },
      })
    }
  })

  return { should, must }
}

export const getConditionByFacilityAssetsAggregations = async (tenantId, filter) => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}

  const filterQuery = filterKeysToESQuery(filter)

  const results = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      size: 0,
      aggs: {
        facilities: {
          terms: { field: 'facility.id.keyword' },
          aggs: {
            conditions: {
              terms: { field: 'facets.condition.code.keyword' },
            },
            facilityName: {
              terms: { field: 'facility.name.keyword' },
            },
          },
        },
      },
      query: {
        bool: {
          must: [
            {
              match: {
                dataType: 'asset',
              },
            },
            {
              match: {
                version: 'v0000',
              },
            },
            ...filterQuery.must,
          ],
          should: filterQuery.should,
          minimum_should_match: filterQuery.should.length > 0 ? 1 : 0,
        },
      },
    },
  })
  return simplifyConditionByFacilityAssetsAggregation(results)
}

export const getMyEstateStatus = async tenantId => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}
  let result

  result = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      size: 0,
      aggs: {
        totalFacilities: {
          filter: {
            term: {
              'dataType.keyword': 'facility',
            },
          },
        },
        totalSpaces: {
          filter: {
            term: {
              'dataType.keyword': 'space',
            },
          },
        },
        totalAssets: {
          filter: {
            term: {
              'dataType.keyword': 'asset',
            },
          },
          aggs: {
            sumQuantity: {
              sum: {
                field: 'facets.quantity',
              },
            },
          },
        },
      },
      query: {
        bool: {
          must: [
            {
              match: {
                version: 'v0000',
              },
            },
          ],
          must_not: [
            {
              match: {
                isDeleted: true,
              },
            },
          ],
        },
      },
    },
  })
  const totalFacilities = formatNumber(result.aggregations.totalFacilities.doc_count)
  const totalSpaces = formatNumber(result.aggregations.totalSpaces.doc_count)
  const totalAssets = formatNumber(result.aggregations.totalAssets.sumQuantity.value)
  // console.log(`totalFacilities ${totalFacilities} totalSpaces ${totalSpaces} totalAssets ${totalAssets}`)

  result = await esClient.search({
    index: `${environment}-shared`,
    type: 'hierarchy',
    body: {
      size: 0,
      aggs: {
        assetTypes: {
          nested: {
            path: 'hierarchy.children.children',
          },
          aggs: {
            assetTypes: {
              terms: {
                field: 'hierarchy.children.children.type.keyword',
                size: 10000,
              },
            },
          },
        },
      },
      query: {
        match: {
          tenantId,
        },
      },
    },
  })
  const assetTypeList = result.aggregations.assetTypes.assetTypes.buckets.map(item => item.key)

  result = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      size: 0,
      aggs: {
        assetTypes: {
          terms: {
            field: 'assetType.tree.keyword',
            size: 10000,
          },
        },
        operationalAssets: {
          filter: {
            term: {
              'facets.asset-status.keyword': 'Operating',
            },
          },
        },
        maintainedAssets: {
          filter: {
            term: {
              'facets.maintenance-requirement.keyword': 'Maintain',
            },
          },
        },
      },
      query: {
        bool: {
          must: [
            {
              match: {
                dataType: 'asset',
              },
            },
            {
              match: {
                version: 'v0000',
              },
            },
          ],
        },
      },
    },
  })
  const operationalAssets = formatNumber(result.aggregations.operationalAssets.doc_count)
  const maintainedAssets = formatNumber(result.aggregations.maintainedAssets.doc_count)

  let totalAssetTypes = 0
  assetTypeList.forEach(item => {
    if (result.aggregations.assetTypes.buckets.find(assetType => assetType.key === item)) {
      totalAssetTypes += 1
    }
  })

  totalAssetTypes = formatNumber(totalAssetTypes)

  return {
    totalFacilities,
    totalSpaces,
    totalAssets,
    operationalAssets,
    maintainedAssets,
    totalAssetTypes,
  }
}

export const getReplacementCostStatistics = async tenantId => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}

  const result = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      size: 0,
      aggs: {
        P1P2UrgentHighCToDX: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['Urgent', 'High'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            replacementCost: {
              sum: {
                field: 'spons.replacementCost',
              },
            },
          },
        },
        P1UrgentCToDX: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['Urgent'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            replacementCost: {
              sum: {
                field: 'spons.replacementCost',
              },
            },
          },
        },
        P2HighCToDX: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['High'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            replacementCost: {
              sum: {
                field: 'spons.replacementCost',
              },
            },
          },
        },
        P3P4LowToVLowCToDx: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['Low', 'V Low'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            replacementCost: {
              sum: {
                field: 'spons.replacementCost',
              },
            },
          },
        },
      },
      query: {
        bool: {
          must: [
            {
              match: {
                version: 'v0000',
              },
            },
            {
              match: {
                dataType: 'asset',
              },
            },
          ],
          must_not: [
            {
              match: {
                isDeleted: true,
              },
            },
          ],
        },
      },
    },
  })

  return {
    P1P2UrgentHighCToDX: formatNumber(
      result.aggregations.P1P2UrgentHighCToDX.replacementCost.value,
    ),
    P1UrgentCToDX: formatNumber(result.aggregations.P1UrgentCToDX.replacementCost.value),
    P2HighCToDX: formatNumber(result.aggregations.P2HighCToDX.replacementCost.value),
    P3P4LowToVLowCToDx: formatNumber(result.aggregations.P3P4LowToVLowCToDx.replacementCost.value),
  }
}

export const getAssetsGroupedByFacility = async (tenantId, filter) => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}
  const filterQuery = filterKeysToESQuery(filter)
  const results = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      size: 0,
      aggs: {
        facilities: {
          aggs: {
            years: {
              terms: {
                script: 'return doc["spons.eol"].date.getYear()',
              },
              aggs: {
                cost: {
                  sum: { field: 'spons.replacementCost' },
                },
              },
            },
          },
          terms: {
            field: 'facility.name.keyword',
          },
        },
      },
      query: {
        bool: {
          must: [
            {
              match: {
                dataType: 'asset',
              },
            },
            {
              match: {
                version: 'v0000',
              },
            },
            ...filterQuery.must,
          ],
          should: filterQuery.should,
          minimum_should_match: filterQuery.should.length > 0 ? 1 : 0,
          must_not: [
            {
              match: {
                isDeleted: true,
              },
            },
          ],
        },
      },
    },
  })

  return results.aggregations.facilities.buckets.map(facility => ({
    name: facility.key,
    years: facility.years.buckets.reduce((memo, year) => {
      memo[year.key] = year.cost.value
      return memo
    }, {}),
  }))
}

export const getAssetsBySystemAndType = async (tenantId, filter) => {
  const esClient = await configureES(tenantId)
  const { environment } = window.mwa_config || {}

  const filterQuery = filterKeysToESQuery(filter)

  const results = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      size: 0,
      aggs: {
        assetTypes: {
          terms: {
            field: 'assetType.tree.keyword',
            size: 100,
            order: {
              _count: 'desc',
            },
          },
          aggs: {
            subType: {
              terms: {
                field: 'assetType.description.keyword',
                size: 20,
                order: {
                  _count: 'desc',
                },
              },
              aggs: {
                assetType: {
                  top_hits: {
                    _source: {
                      includes: ['assetType'],
                    },
                    size: 1,
                  },
                },
              },
            },
          },
        },
      },
      query: {
        bool: {
          must: [
            {
              match: {
                dataType: 'asset',
              },
            },
            {
              match: {
                version: 'v0000',
              },
            },
            ...filterQuery.must,
          ],
          should: filterQuery.should,
          minimum_should_match: filterQuery.should.length > 0 ? 1 : 0,
        },
      },
    },
  })

  return results.aggregations.assetTypes.buckets
    .filter(
      type => type.key === type.subType.buckets[0].assetType.hits.hits[0]._source.assetType.tree[0],
    )
    .slice(0, NUMBER_OF_BUBBLES_IN_CHART)
    .map(obj => ({
      doc_count: obj.doc_count,
      key: obj.key,
      subTypes: obj.subType.buckets.map(subTypeObj => ({
        doc_count: subTypeObj.doc_count,
        key: subTypeObj.key,
        assetType: subTypeObj.assetType.hits.hits[0]._source.assetType,
      })),
    }))
}

export const getAssetCostsByPriority = async (tenantId, filter) => {
  const esClient = await configureES(tenantId)
  const { environment } = (await mwaConfig()) || {}
  const filterQuery = filterKeysToESQuery(filter)

  const result = await esClient.search({
    index: `${environment}-${tenantId.toLowerCase()}`,
    type: esType,
    body: {
      size: 0,
      aggs: {
        P1UrgentCToDX: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['Urgent'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            cost: {
              nested: {
                path: 'cost.simple',
              },
              aggs: {
                simple: {
                  terms: {
                    field: 'cost.simple.year',
                  },
                  aggs: {
                    replacement: {
                      sum: {
                        field: 'cost.simple.replacement',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        P2HighCToDX: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['High'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            cost: {
              nested: {
                path: 'cost.simple',
              },
              aggs: {
                simple: {
                  terms: {
                    field: 'cost.simple.year',
                  },
                  aggs: {
                    replacement: {
                      sum: {
                        field: 'cost.simple.replacement',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        P3MediumCToDX: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['Medium'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            cost: {
              nested: {
                path: 'cost.simple',
              },
              aggs: {
                simple: {
                  terms: {
                    field: 'cost.simple.year',
                  },
                  aggs: {
                    replacement: {
                      sum: {
                        field: 'cost.simple.replacement',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        P4LowToVLowCToDx: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    'facets.criticality.keyword': ['Low', 'V Low'],
                  },
                },
                {
                  terms: {
                    'facets.condition.code.keyword': ['C', 'CX', 'D', 'DX'],
                  },
                },
              ],
            },
          },
          aggs: {
            cost: {
              nested: {
                path: 'cost.simple',
              },
              aggs: {
                simple: {
                  terms: {
                    field: 'cost.simple.year',
                  },
                  aggs: {
                    replacement: {
                      sum: {
                        field: 'cost.simple.replacement',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      query: {
        bool: {
          must: [
            {
              match: {
                version: 'v0000',
              },
            },
            {
              match: {
                dataType: 'asset',
              },
            },
            ...filterQuery.must,
          ],
          should: filterQuery.should,
          minimum_should_match: filterQuery.should.length > 0 ? 1 : 0,
          must_not: [
            {
              match: {
                isDeleted: true,
              },
            },
          ],
        },
      },
    },
  })

  return {
    P1UrgentCToDX: {
      name: 'P1 - Urgent: C, Cx, D and DX',
      color: colors['error-pink'],
      simpleReplacementCost: result.aggregations.P1UrgentCToDX.cost.simple.buckets,
    },
    P2HighCToDX: {
      name: 'P2 - High: C, Cx, D and DX',
      color: colors['warning-amber'],
      simpleReplacementCost: result.aggregations.P2HighCToDX.cost.simple.buckets,
    },
    P3MediumCToDX: {
      name: 'P3 - Medium: C, Cx, D and DX',
      color: colors['battleship-grey'],
      simpleReplacementCost: result.aggregations.P3MediumCToDX.cost.simple.buckets,
    },
    P4LowToVLowCToDx: {
      name: 'P4 - Low and Very low: C, Cx, D and DX',
      color: colors.sage,
      simpleReplacementCost: result.aggregations.P4LowToVLowCToDx.cost.simple.buckets,
    },
  }
}
