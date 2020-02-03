const { Client } = require('elasticsearch')

const esClient = Client({
  host: process.env.ELASTICSEARCH_HOST,
  connectionClass: require('http-aws-es'),
})

module.exports.getHierarchyFromCache = async (environment, tenantId) => {
  try {
    console.log(`getHierarchyFromCache for tenant ${environment}-${tenantId}`)
    const esIndex = `${environment}-shared`
    const esType = 'hierarchy'

    const curData = await esClient.search({
      index: esIndex,
      type: esType,
      body: {
        query: {
          match: {
            tenantId,
          },
        },
        _source: {
          excludes: [
            'hierarchy.children.children.replacementCost',
            'hierarchy.children.children.nrm',
            'hierarchy.children.children.rics',
            'hierarchy.children.children.sfg-20-ref',
            'hierarchy.children.children.sfg-20-version',
          ],
        },
      },
    })
    if (!curData.hits.hits[0]) {
      console.error('getHierarchyFromCache no hits returned')
      return {}
    }
    console.log('getHierarchyFromCache returned', curData.hits.hits[0])
    return { ...curData.hits.hits[0]._source }
  } catch (e) {
    console.error('getHierarchyFromCache error', e)
  }
  return {}
}

module.exports.getAdditionalAssetDataByIdFromCache = async (
  environment,
  tenantId,
  assetTypeTree,
) => {
  try {
    const esIndex = `${environment}-shared`
    const esType = 'hierarchy'
    let path = 'hierarchy.children'
    if (assetTypeTree.length === 3) {
      path += '.children'
    }
    const curData = await esClient.search({
      index: esIndex,
      type: esType,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  tenantId,
                },
              },
              {
                nested: {
                  path,
                  query: {
                    bool: {
                      must: assetTypeTree.map(obj => ({
                        match: {
                          [`${path}.tree.keyword`]: obj,
                        },
                      })),
                    },
                  },
                  inner_hits: {
                    _source: {
                      includes: [
                        `${path}.lifecycle`,
                        `${path}.replacementCost`,
                        `${path}.nrm`,
                        `${path}.rics`,
                        `${path}.sfg-20-ref`,
                        `${path}.sfg-20-version`,
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        _source: false,
      },
    })
    if (!curData.hits.hits[0]) {
      console.error('getAdditionalAssetDataByIdFromCache no hits returned')
      return {}
    }

    return {
      ...curData.hits.hits[0].inner_hits[path].hits.hits[0]._source,
    }
  } catch (e) {
    console.error('getAdditionalAssetDataByIdFromCache error', e)
  }
  return {}
}
