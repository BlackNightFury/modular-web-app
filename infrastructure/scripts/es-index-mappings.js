const sharedIndexMappings = {
  hierarchy: {
    properties: {
      hierarchy: {
        type: 'nested',
        properties: {
          children: {
            type: 'nested',
            properties: {
              children: {
                type: 'nested',
              }
            }
          }
        }
      }
    }
  }
}

const tenantIndexMappings = {
  docs: {
    properties: {
      facets : {
        type: "object",
        properties: {
          'asset-status': { "type":"text"},
          'phase-no': { "type":"text"},
          quantity : { "type" : "double" }
        }
      },
      cost: {
        type: "nested",
        properties: {
          simple: {
            type: "nested",
            properties: {
              year : { "type" : "double" },
              replacement: { "type" : "double" }
            }
          }
        }
      }
    }
  }
}

module.exports = {
  sharedIndexMappings,
  tenantIndexMappings,
}