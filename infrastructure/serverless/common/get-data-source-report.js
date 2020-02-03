const { Client } = require('elasticsearch')
const { getQueryFilterOptions } = require('../utils')
// Using scroll api to mutate elastic search while iterating
const applyQuery = async (esIndex, query, excludes) => {
  try {
    const esClient = Client({
      host: process.env.ELASTICSEARCH_HOST,
      connectionClass: require('http-aws-es'),
    })
    const esType = 'docs'

    const totalRecords = []
    let response = await esClient.search({
      index: esIndex,
      type: esType,
      scroll: '20s',
      size: 10000,
      body: {
        _source: excludes ? { excludes } : {},
        query,
      },
    })

    response.hits.hits.forEach(hit => {
      totalRecords.push(hit._source)
    })
    while (response.hits.total !== totalRecords.length) {
      response = await esClient.scroll({
        scrollId: response._scroll_id,
        scroll: '20s',
      })

      response.hits.hits.forEach(hit => {
        totalRecords.push(hit._source)
      })
    }

    return totalRecords
  } catch (err) {
    throw err
  }
}

const getDataSourceForAssetManagement = async (filters, esIndex, environment) => {
  try {
    const { assetType, ...restFilters } = filters
    const restQueryFilterOptions = getQueryFilterOptions(restFilters)
    const queryFilterOptions = [
      { term: { dataType: 'asset' } },
      { term: { version: 'v0000' } },
      { term: { environment } },
      ...restQueryFilterOptions,
    ]

    if (assetType && assetType.class !== 'ALL') {
      queryFilterOptions.push({
        term: { 'assetType.virtual': assetType.class === 'VIRTUAL' },
      })
    }

    const query = {
      bool: {
        must: [
          {
            bool: {
              filter: queryFilterOptions,
            },
          },
        ],
      },
    }
    if (assetType && assetType.trees) {
      const assetTypeQuery = {
        bool: {
          should: [],
        },
      }
      assetType.trees.forEach(tree => {
        assetTypeQuery.bool.should.push({
          bool: {
            filter: tree.map(obj => ({ term: { 'assetType.tree.keyword': obj } })),
          },
        })
      })

      query.bool.must.push(assetTypeQuery)
    }

    const filteredAssets = await applyQuery(esIndex, query, [
      'images',
      'createdAt',
      'createdUser',
      'dataType',
      'currentVersion',
      'version',
      'createdBy',
      'createdAtClient',
      'environment',
    ])

    return filteredAssets
  } catch (err) {
    throw err
  }
}

module.exports.getDataSourceForAssetManagement = getDataSourceForAssetManagement
